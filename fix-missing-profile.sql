-- =====================================================
-- FIX PARA USUARIO SIN PERFIL
-- =====================================================

-- 1. Crear perfil manualmente para el usuario actual
INSERT INTO public.user_profiles (user_id, full_name, chamuyo_level, total_points)
SELECT 
    id as user_id,
    COALESCE(raw_user_meta_data->>'full_name', email) as full_name,
    1 as chamuyo_level,
    0 as total_points
FROM auth.users 
WHERE id = 'c5b4bd83-d750-4409-b5d8-01b61ee3206f'
ON CONFLICT (user_id) DO NOTHING;

-- 2. Crear perfiles para TODOS los usuarios que no tengan uno
INSERT INTO public.user_profiles (user_id, full_name, chamuyo_level, total_points)
SELECT 
    u.id as user_id,
    COALESCE(u.raw_user_meta_data->>'full_name', u.email) as full_name,
    1 as chamuyo_level,
    0 as total_points
FROM auth.users u
LEFT JOIN public.user_profiles p ON u.id = p.user_id
WHERE p.user_id IS NULL
ON CONFLICT (user_id) DO NOTHING;

-- 3. Verificar que el trigger existe y funciona
DO $$
BEGIN
    -- Recrear el trigger si no existe
    DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
    
    CREATE TRIGGER on_auth_user_created
        AFTER INSERT ON auth.users
        FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
        
    RAISE NOTICE '✅ Trigger de creación automática de perfiles reinstalado';
END $$;

-- 4. Verificar que la función handle_new_user existe
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (user_id, full_name, chamuyo_level, total_points)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
        1,
        0
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Verificar resultados
DO $$
DECLARE
    missing_count INTEGER;
    total_users INTEGER;
BEGIN
    SELECT COUNT(*) INTO total_users FROM auth.users;
    
    SELECT COUNT(*) INTO missing_count 
    FROM auth.users u
    LEFT JOIN public.user_profiles p ON u.id = p.user_id
    WHERE p.user_id IS NULL;
    
    RAISE NOTICE '📊 Total usuarios: %, Usuarios sin perfil: %', total_users, missing_count;
    
    IF missing_count = 0 THEN
        RAISE NOTICE '✅ Todos los usuarios tienen perfil creado';
    ELSE
        RAISE NOTICE '⚠️ Aún hay % usuarios sin perfil', missing_count;
    END IF;
END $$; 