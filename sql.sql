CREATE TRIGGER trg_InsertUsuario
ON Usuario
AFTER INSERT
AS
BEGIN
    DECLARE @bitacorizar CHAR(1);
    DECLARE @idOperacion INT, @idEnc INT, @usuarioBdd VARCHAR(100), @fechaFinOperacion DATETIME;
    DECLARE @tiempoOperacionBdd TIME;

    -- Verificar si la tabla 'Usuario' está configurada para bitacorización
    SELECT @bitacorizar = bitacorizar 
    FROM Tablas_Bitacoriza 
    WHERE tabla = 'Usuario';

    IF @bitacorizar = 'S'
    BEGIN
        SET @usuarioBdd = SYSTEM_USER; -- Usuario de la base de datos que realizó la operación

        -- Registrar operación en Operaciones_Sistemas (fechaOperacion se captura aquí automáticamente)
        INSERT INTO Operaciones_Sistemas (nombreOperacion, descripcion, usuario, fechaOperacion, usuarioBdd)
        VALUES ('INSERT', 'Inserción de nuevo usuario', @usuarioBdd, GETDATE(), @usuarioBdd);

        SET @idOperacion = SCOPE_IDENTITY();

        -- Registrar encabezado de bitácora
        INSERT INTO Encabezado_Bitacora (nombreTabla, operacion, llaveFila, camposPk, usuario, fechaRegistro, idOperacion, usuarioBdd)
        SELECT 'Usuario', 'INSERT', CAST(i.idUsuario AS VARCHAR), CAST(i.idUsuario AS VARCHAR), @usuarioBdd, GETDATE(), @idOperacion, @usuarioBdd
        FROM inserted i;

        SET @idEnc = SCOPE_IDENTITY();

        -- Registrar detalles de bitácora para cada campo insertado
        INSERT INTO Detalle_Bitacora (idEnc, nombreCampo, valorAnterior, valorNuevo)
        SELECT @idEnc, 'nombreUsuario', NULL, i.nombreUsuario FROM inserted i
        UNION ALL
        SELECT @idEnc, 'email', NULL, i.email FROM inserted i
        UNION ALL
        SELECT @idEnc, 'idGrupo', NULL, CAST(i.idGrupo AS VARCHAR) FROM inserted i;

        -- Simular un pequeño retraso en el procesamiento (en una operación real, el código tomará tiempo)
        WAITFOR DELAY '00:00:01'; -- Esto es solo un ejemplo para simular el paso del tiempo (1 segundo)

        -- Capturar la fecha de finalización de la operación
        SET @fechaFinOperacion = GETDATE();

        -- Calcular la diferencia en milisegundos y convertirlo a TIME
        DECLARE @diferenciaMilisegundos INT;
        SET @diferenciaMilisegundos = DATEDIFF(MILLISECOND, (SELECT fechaOperacion FROM Operaciones_Sistemas WHERE idOperacion = @idOperacion), @fechaFinOperacion);

        -- Convertir la diferencia de milisegundos a formato TIME
        SET @tiempoOperacionBdd = CAST(DATEADD(MILLISECOND, @diferenciaMilisegundos, '00:00:00') AS TIME(3));

        -- Actualizar la operación con la fecha de finalización y el tiempo de operación
        UPDATE Operaciones_Sistemas
        SET fechaFinOperacion = @fechaFinOperacion,
            tiempoOperacionBdd = @tiempoOperacionBdd
        WHERE idOperacion = @idOperacion;
    END;
END;
