-- =====================================================
-- SISTEMA SIMPLE DE LÍMITES DIARIOS - 7 MENSAJES
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
CREATE TRIGGER handle_updated_at_daily_tracking BEFORE UPDATE ON public.daily_message_tracking
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- =====================================================
-- FUNCIONES SIMPLES PARA LÍMITE DE 7 MENSAJES
-- =====================================================

-- Función para verificar si un usuario puede enviar mensajes (límite fijo: 7)
CREATE OR REPLACE FUNCTION check_daily_message_limit_simple(p_user_id UUID)
RETURNS TABLE(
    can_send BOOLEAN,
    messages_sent INTEGER,
    messages_remaining INTEGER,
    is_limit_reached BOOLEAN
) AS $$
DECLARE
    v_messages_sent INTEGER;
    v_daily_limit INTEGER := 7; -- Límite fijo por ahora
BEGIN
    -- Obtener mensajes enviados hoy
    SELECT COALESCE(message_count, 0) INTO v_messages_sent
    FROM daily_message_tracking
    WHERE user_id = p_user_id AND date = CURRENT_DATE;
    
    -- Si no hay registro, el usuario no ha enviado mensajes hoy
    IF v_messages_sent IS NULL THEN
        v_messages_sent := 0;
    END IF;
    
    -- Retornar resultados
    can_send := v_messages_sent < v_daily_limit;
    messages_sent := v_messages_sent;
    messages_remaining := GREATEST(0, v_daily_limit - v_messages_sent);
    is_limit_reached := v_messages_sent >= v_daily_limit;
    
    RETURN NEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para incrementar contador de mensajes (límite fijo: 7)
CREATE OR REPLACE FUNCTION increment_daily_message_count_simple(p_user_id UUID)
RETURNS TABLE(
    new_count INTEGER,
    limit_reached BOOLEAN,
    is_last_message BOOLEAN
) AS $$
DECLARE
    v_new_count INTEGER;
    v_daily_limit INTEGER := 7; -- Límite fijo por ahora
BEGIN
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
    limit_reached := v_new_count >= v_daily_limit;
    is_last_message := v_new_count = v_daily_limit; -- Es el mensaje #7
    
    RETURN NEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- FUNCIÓN DE LIMPIEZA (OPCIONAL)
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

-- =====================================================
-- VISTA SIMPLE PARA ESTADÍSTICAS
-- =====================================================

-- Vista para ver estadísticas diarias simples
CREATE OR REPLACE VIEW daily_usage_stats AS
SELECT 
    date,
    COUNT(DISTINCT user_id) as active_users,
    AVG(message_count) as avg_messages_per_user,
    SUM(message_count) as total_messages,
    COUNT(CASE WHEN message_count >= 7 THEN 1 END) as users_hit_limit
FROM daily_message_tracking
GROUP BY date
ORDER BY date DESC;

-- Mensaje de éxito
DO $$
BEGIN
    RAISE NOTICE '✅ Sistema simple de límites diarios creado exitosamente!';
    RAISE NOTICE '📊 Límite fijo: 7 mensajes diarios para todos los usuarios';
    RAISE NOTICE '🔧 Funciones disponibles: check_daily_message_limit_simple(), increment_daily_message_count_simple()';
    RAISE NOTICE '📈 Vista disponible: daily_usage_stats';
END $$; 