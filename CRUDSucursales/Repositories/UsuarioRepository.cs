using CRUDSucursales.Interfaces;
using CRUDSucursales.Models;
using Dapper;
using Microsoft.Data.SqlClient;
using BCrypt.Net;

public class UsuarioRepository : IUsuarioRepository
{
    private readonly IConfiguration _config;
    private readonly string _connStr;

    public UsuarioRepository(IConfiguration config)
    {
        _config = config;
        _connStr = _config.GetConnectionString("DefaultConnection");
    }

    public async Task<Usuario?> GetUsuario(string username, string password)
    {
        await using var connection = new SqlConnection(_connStr);

        const string sql = @"EXEC sp_bt_LoginUsuario @username, @password";

        var result = await connection.QueryAsync<Usuario, string, Usuario>(
            sql,
            (usuario, rol) =>
            {
                usuario.Roles ??= new List<string>();
                usuario.Roles.Add(rol);
                return usuario;
            },
            new { username, password },
            splitOn: "Rol"
        );

        var user = result.FirstOrDefault();
        if (user == null)
            return null;

        // Obtener el hash de la contraseña guardada
        const string hashSql = @"SELECT Password FROM bt_usr_usuario WHERE Usuario = @username AND Estado = 1";
        var hashGuardado = await connection.QueryFirstOrDefaultAsync<string>(hashSql, new { username });

        // Debug: mostrar hashes
        var hashSimulado = BCrypt.Net.BCrypt.HashPassword("123456", workFactor: 11);
        Console.WriteLine("**************************************************");
        Console.WriteLine($"[DEBUG] Hash en la base de datos: {hashGuardado}");        
        Console.WriteLine("**************************************************");

        if (hashGuardado == null || !BCrypt.Net.BCrypt.Verify(password, hashGuardado))
        {
            Console.WriteLine("[DEBUG] Contraseña inválida.");
            return null;
        }

        Console.WriteLine("[DEBUG] Login exitoso, retornando usuario.");
        return user;
    }

    public async Task InsertarToken(int idUsuario, string token)
    {
        await using var connection = new SqlConnection(_connStr);

        const string insertTokenSql = @"
            INSERT INTO bt_usr_token (IdUsuario, Token, FechaExpiracion)
            VALUES (@IdUsuario, @Token, @FechaExpiracion);
        ";

        await connection.ExecuteAsync(insertTokenSql, new
        {
            IdUsuario = idUsuario,
            Token = token,
            FechaExpiracion = DateTime.UtcNow.AddHours(2)
        });
    }
}
