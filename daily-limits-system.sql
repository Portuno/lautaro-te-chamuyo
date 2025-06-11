-- =====================================================
-- SISTEMA DE LÍMITES DIARIOS DE MENSAJES
-- =====================================================

-- Tabla para trackear mensajes diarios por usuario
CREATE TABLE IF NOT EXISTS public.daily_message_tracking (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    message_count INTEGER DEFAULT 0 CHECK (message_count >= 0),
    last_message_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- Un usuario solo puede tener un registro por día
    UNIQUE(user_id, date)
);

-- Habilitar RLS
ALTER TABLE public.daily_message_tracking ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Users can view own daily tracking" ON public.daily_message_tracking
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own daily tracking" ON public.daily_message_tracking
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own daily tracking" ON public.daily_message_tracking
    FOR UPDATE USING (auth.uid() = user_id);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_daily_tracking_user_date ON public.daily_message_tracking(user_id, date);
CREATE INDEX IF NOT EXISTS idx_daily_tracking_date ON public.daily_message_tracking(date);

-- Trigger para updated_at
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.daily_message_tracking
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- =====================================================
-- TABLA DE CONFIGURACIÓN DE LÍMITES POR NIVEL
-- =====================================================

CREATE TABLE IF NOT EXISTS public.level_limits_config (
    level_number INTEGER PRIMARY KEY,
    daily_message_limit INTEGER NOT NULL CHECK (daily_message_limit > 0),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insertar configuración de límites por nivel
INSERT INTO public.level_limits_config (level_number, daily_message_limit, description) VALUES
(1, 7, 'Pibe Nuevo - 7 mensajes diarios'),
(2, 10, 'Vecino del Barrio - 10 mensajes diarios'),
(3, 15, 'Amigo del Kiosquero - 15 mensajes diarios'),
(4, 20, 'Hincha de Corazón - 20 mensajes diarios'),
(5, 25, 'Asador Principiante - 25 mensajes diarios'),
(6, 30, 'Tomador de Mate - 30 mensajes diarios'),
(7, 40, 'Conocedor de Tangos - 40 mensajes diarios'),
(8, 50, 'Porteño Honorario - 50 mensajes diarios'),
(9, 60, 'Gaucho de Escritorio - 60 mensajes diarios'),
(10, 75, 'Maestro del Asado - 75 mensajes diarios'),
(11, 90, 'Filósofo de Café - 90 mensajes diarios'),
(12, 110, 'Barra Brava - 110 mensajes diarios'),
(13, 130, 'Caminador de Buenos Aires - 130 mensajes diarios'),
(14, 150, 'Experto en Empanadas - 150 mensajes diarios'),
(15, 175, 'Milonguero - 175 mensajes diarios'),
(16, 200, 'Conocedor de Vinos - 200 mensajes diarios'),
(17, 250, 'Prócer del Chamuyo - 250 mensajes diarios'),
(18, 300, 'Crack del Barrio - 300 mensajes diarios'),
(19, 400, 'Leyenda Viviente - 400 mensajes diarios'),
(20, 500, 'Dios del Chamuyo - 500 mensajes diarios'),
(21, 750, 'Inmortal del Río de la Plata - 750 mensajes diarios'),
(22, 999999, 'El Mismísimo Lautaro - Sin límites')
ON CONFLICT (level_number) DO UPDATE SET
    daily_message_limit = EXCLUDED.daily_message_limit,
    description = EXCLUDED.description;

-- Política para que todos puedan leer la configuración de límites
ALTER TABLE public.level_limits_config ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view level limits" ON public.level_limits_config
    FOR SELECT TO PUBLIC USING (true);

-- =====================================================
-- FUNCIONES PARA MANEJO DE LÍMITES
-- =====================================================

-- Función para verificar si un usuario puede enviar mensajes
CREATE OR REPLACE FUNCTION check_daily_message_limit(p_user_id UUID)
RETURNS TABLE(
    can_send BOOLEAN,
    messages_sent INTEGER,
    message_limit INTEGER,
    messages_remaining INTEGER,
    is_limit_reached BOOLEAN,
    user_level INTEGER
) AS $$
DECLARE
    v_user_level INTEGER;
    v_message_limit INTEGER;
    v_messages_sent INTEGER;
BEGIN
    -- Obtener nivel del usuario
    SELECT chamuyo_level INTO v_user_level
    FROM user_profiles
    WHERE user_id = p_user_id;
    
    -- Si no tiene perfil, asumir nivel 1
    IF v_user_level IS NULL THEN
        v_user_level := 1;
    END IF;
    
    -- Obtener límite para este nivel
    SELECT daily_message_limit INTO v_message_limit
    FROM level_limits_config
    WHERE level_number = v_user_level;
    
    -- Si no hay configuración, usar límite por defecto
    IF v_message_limit IS NULL THEN
        v_message_limit := 7; -- Límite por defecto para nivel 1
    END IF;
    
    -- Obtener mensajes enviados hoy
    SELECT COALESCE(message_count, 0) INTO v_messages_sent
    FROM daily_message_tracking
    WHERE user_id = p_user_id AND date = CURRENT_DATE;
    
    -- Si no hay registro, el usuario no ha enviado mensajes hoy
    IF v_messages_sent IS NULL THEN
        v_messages_sent := 0;
    END IF;
    
    -- Retornar resultados
    can_send := v_messages_sent < v_message_limit;
    messages_sent := v_messages_sent;
    message_limit := v_message_limit;
    messages_remaining := GREATEST(0, v_message_limit - v_messages_sent);
    is_limit_reached := v_messages_sent >= v_message_limit;
    user_level := v_user_level;
    
    RETURN NEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para incrementar contador de mensajes
CREATE OR REPLACE FUNCTION increment_daily_message_count(p_user_id UUID)
RETURNS TABLE(
    new_count INTEGER,
    limit_reached BOOLEAN
) AS $$
DECLARE
    v_new_count INTEGER;
    v_limit INTEGER;
    v_user_level INTEGER;
BEGIN
    -- Obtener nivel y límite del usuario
    SELECT chamuyo_level INTO v_user_level
    FROM user_profiles
    WHERE user_id = p_user_id;
    
    SELECT daily_message_limit INTO v_limit
    FROM level_limits_config
    WHERE level_number = COALESCE(v_user_level, 1);
    
    -- Insertar o actualizar contador diario
    INSERT INTO daily_message_tracking (user_id, date, message_count, last_message_at)
    VALUES (p_user_id, CURRENT_DATE, 1, timezone('utc'::text, now()))
    ON CONFLICT (user_id, date)
    DO UPDATE SET
        message_count = daily_message_tracking.message_count + 1,
        last_message_at = timezone('utc'::text, now()),
        updated_at = timezone('utc'::text, now());
    
    -- Obtener el nuevo contador
    SELECT message_count INTO v_new_count
    FROM daily_message_tracking
    WHERE user_id = p_user_id AND date = CURRENT_DATE;
    
    new_count := v_new_count;
    limit_reached := v_new_count >= COALESCE(v_limit, 7);
    
    RETURN NEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- LIMPIAR REGISTROS ANTIGUOS (EJECUTAR PERIODICAMENTE)
-- =====================================================

-- Función para limpiar registros antiguos (más de 30 días)
CREATE OR REPLACE FUNCTION cleanup_old_daily_tracking()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM daily_message_tracking
    WHERE date < CURRENT_DATE - INTERVAL '30 days';
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Mensaje de éxito
DO $$
BEGIN
    RAISE NOTICE '✅ Sistema de límites diarios creado exitosamente!';
    RAISE NOTICE '📊 Configuración: Nivel 1 = 7 mensajes, Nivel 22 = Sin límites';
    RAISE NOTICE '🔧 Funciones disponibles: check_daily_message_limit(), increment_daily_message_count()';
END $$; 