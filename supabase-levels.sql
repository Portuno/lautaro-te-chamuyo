-- =====================================================
-- TABLA DE NIVELES DE CHAMUYO - 22 NIVELES
-- =====================================================

-- Crear tabla de niveles
CREATE TABLE IF NOT EXISTS public.chamuyo_levels (
    id SERIAL PRIMARY KEY,
    level_number INTEGER UNIQUE NOT NULL CHECK (level_number >= 1 AND level_number <= 22),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    min_points INTEGER NOT NULL CHECK (min_points >= 0),
    max_points INTEGER CHECK (max_points > min_points),
    badge_emoji TEXT DEFAULT '🎯',
    color_hex TEXT DEFAULT '#8B4513',
    special_ability TEXT, -- Habilidad especial que desbloquea este nivel
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insertar los 22 niveles con temática argentina
INSERT INTO public.chamuyo_levels (level_number, name, description, min_points, max_points, badge_emoji, color_hex, special_ability) VALUES
(1, 'Pibe Nuevo', 'Recién llegás al barrio del chamuyo', 0, 99, '👶', '#8B4513', 'Respuestas básicas'),
(2, 'Vecino del Barrio', 'Ya te conocen en la cuadra', 100, 199, '🏠', '#654321', 'Más variedad en respuestas'),
(3, 'Amigo del Kiosquero', 'El kiosquero ya te fía', 200, 349, '🏪', '#8B4513', 'Easter eggs ocasionales'),
(4, 'Hincha de Corazón', 'Elegiste tu cuadro favorito', 350, 549, '⚽', '#FF6B35', 'Referencias futbolísticas'),
(5, 'Asador Principiante', 'Sabés prender el fuego', 550, 799, '🔥', '#D2691E', 'Historias de asados'),
(6, 'Tomador de Mate', 'Ya sabés cebar como la gente', 800, 1099, '🧉', '#228B22', 'Sabiduría mateística'),
(7, 'Conocedor de Tangos', 'Distinguís un Gardel de un Pugliese', 1100, 1449, '🎵', '#4B0082', 'Quotes de tango'),
(8, 'Porteño Honorario', 'Hablás como de Barracas', 1450, 1849, '🏙️', '#FF69B4', 'Lunfardo avanzado'),
(9, 'Gaucho de Escritorio', 'Trabajás pero con alma de campo', 1850, 2299, '🤠', '#8B4513', 'Sabiduría gauchesca'),
(10, 'Maestro del Asado', 'Tu asado es legendario', 2300, 2799, '🥩', '#B22222', 'Técnicas de parrilla'),
(11, 'Filósofo de Café', 'Resolvés la vida en un cortado', 2800, 3349, '☕', '#8B4513', 'Filosofía de bar'),
(12, 'Barra Brava', 'Aguantás a tu equipo en las malas', 3350, 3949, '🎺', '#FF4500', 'Cánticos y aguante'),
(13, 'Caminador de Buenos Aires', 'Conocés cada esquina de CABA', 3950, 4599, '🚶', '#4682B4', 'Historia porteña'),
(14, 'Experto en Empanadas', 'Distinguís una tucumana de una salteña', 4600, 5299, '🥟', '#FFD700', 'Sabiduría culinaria'),
(15, 'Milonguero', 'Bailás tango como Carlos Gardel cantaba', 5300, 6049, '💃', '#8A2BE2', 'Historias de milonga'),
(16, 'Conocedor de Vinos', 'Distinguís un Malbec de Mendoza con los ojos cerrados', 6050, 6849, '🍷', '#722F37', 'Cata de vinos'),
(17, 'Prócer del Chamuyo', 'San Martín te pediría consejos', 6850, 7699, '🎖️', '#DAA520', 'Sabiduría histórica'),
(18, 'Crack del Barrio', 'Sos como Maradona pero del chamuyo', 7700, 8599, '⭐', '#FFD700', 'Jugadas maestras'),
(19, 'Leyenda Viviente', 'Como Evita, pero para el chamuyo', 8600, 9549, '👑', '#FF1493', 'Carisma legendario'),
(20, 'Dios del Chamuyo', 'Nivel Messi del chamuyo', 9550, 10549, '🐐', '#00FF00', 'Respuestas magistrales'),
(21, 'Inmortal del Río de la Plata', 'Trascendiste como Borges', 10550, 11599, '🌟', '#9370DB', 'Sabiduría infinita'),
(22, 'El Mismísimo Lautaro', 'Llegaste al nivel de tu maestro', 11600, 999999, '🔥', '#FF0000', 'Poder absoluto del chamuyo');

-- Habilitar RLS
ALTER TABLE public.chamuyo_levels ENABLE ROW LEVEL SECURITY;

-- Política para que todos puedan leer los niveles
CREATE POLICY "Anyone can view chamuyo levels" ON public.chamuyo_levels
    FOR SELECT TO PUBLIC USING (true);

-- Índice para performance
CREATE INDEX IF NOT EXISTS idx_chamuyo_levels_number ON public.chamuyo_levels(level_number);
CREATE INDEX IF NOT EXISTS idx_chamuyo_levels_points ON public.chamuyo_levels(min_points);

-- =====================================================
-- FUNCIÓN PARA OBTENER NIVEL POR PUNTOS
-- =====================================================

CREATE OR REPLACE FUNCTION get_user_level(user_points INTEGER)
RETURNS TABLE(
    level_number INTEGER,
    name TEXT,
    description TEXT,
    badge_emoji TEXT,
    color_hex TEXT,
    progress_to_next FLOAT
) AS $$
DECLARE
    current_level RECORD;
    next_level RECORD;
BEGIN
    -- Obtener el nivel actual
    SELECT * INTO current_level
    FROM chamuyo_levels
    WHERE min_points <= user_points AND (max_points >= user_points OR max_points IS NULL)
    ORDER BY level_number DESC
    LIMIT 1;
    
    -- Si no hay nivel, devolver el nivel 1
    IF current_level IS NULL THEN
        SELECT * INTO current_level
        FROM chamuyo_levels
        WHERE level_number = 1;
    END IF;
    
    -- Obtener el siguiente nivel
    SELECT * INTO next_level
    FROM chamuyo_levels
    WHERE level_number = current_level.level_number + 1;
    
    -- Calcular progreso hacia el siguiente nivel
    level_number := current_level.level_number;
    name := current_level.name;
    description := current_level.description;
    badge_emoji := current_level.badge_emoji;
    color_hex := current_level.color_hex;
    
    IF next_level IS NOT NULL THEN
        progress_to_next := ROUND(
            ((user_points - current_level.min_points)::FLOAT / 
             (next_level.min_points - current_level.min_points)::FLOAT) * 100, 2
        );
    ELSE
        progress_to_next := 100.0; -- Nivel máximo alcanzado
    END IF;
    
    RETURN NEXT;
END;
$$ LANGUAGE plpgsql;

-- Mensaje de éxito
DO $$
BEGIN
    RAISE NOTICE '🎯 Sistema de niveles de chamuyo creado exitosamente!';
    RAISE NOTICE '📊 22 niveles disponibles desde "Pibe Nuevo" hasta "El Mismísimo Lautaro"';
    RAISE NOTICE '🔧 Función get_user_level() disponible para calcular progreso';
END $$; 