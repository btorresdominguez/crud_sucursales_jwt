using CRUDSucursales.Interfaces;
using CRUDSucursales.Models;
using Dapper;
using Microsoft.Data.SqlClient;
using System.Data;

namespace CRUDSucursales.Repositories
{
    public class SucursalRepository : ISucursalRepository
    {
        private readonly IConfiguration _config;
        private readonly string _connStr;

        public SucursalRepository(IConfiguration config)
        {
            _config = config;
            _connStr = _config.GetConnectionString("DefaultConnection");
        }

        public async Task<IEnumerable<Sucursal>> GetAllAsync()
        {
            await using var conn = new SqlConnection(_connStr);
            return await conn.QueryAsync<Sucursal>(
                "sp_bt_ObtenerSucursales",
                commandType: CommandType.StoredProcedure);
        }

        public async Task<Sucursal?> GetByCodigoAsync(int codigo)
        {
            await using var conn = new SqlConnection(_connStr);
            return await conn.QueryFirstOrDefaultAsync<Sucursal>(
                "sp_bt_ObtenerSucursalPorCodigo",
                   new { Codigo = codigo },
                commandType: CommandType.StoredProcedure);
        }

        public async Task<int> CreateAsync(Sucursal sucursal)
        {
            await using var conn = new SqlConnection(_connStr);
            var newId = await conn.QuerySingleAsync<int>(
                "sp_bt_InsertarSucursal",
                new
                {
                    sucursal.Codigo,
                    sucursal.Descripcion,
                    sucursal.Direccion,
                    sucursal.Identificacion,
                    sucursal.FechaCreacion,
                    sucursal.IdMoneda
                },
                commandType: CommandType.StoredProcedure);
            return newId;
        }

        public async Task<int> UpdateAsync(Sucursal sucursal)
        {
            await using var conn = new SqlConnection(_connStr);

            var result = await conn.ExecuteAsync(
                "sp_bt_ActualizarSucursal",
                new
                {
                    sucursal.Codigo,
                    sucursal.Descripcion,
                    sucursal.Direccion,
                    sucursal.Identificacion,
                    sucursal.FechaCreacion,
                    sucursal.IdMoneda,
                    sucursal.Estado
                },
                commandType: CommandType.StoredProcedure);

            Console.WriteLine($"Filas afectadas: {result}");

            return result; // Retorna el número de filas afectadas
        }


        public async Task<bool> DeleteAsync(int id)
        {
            await using var conn = new SqlConnection(_connStr);
            var rows = await conn.ExecuteAsync(
                "sp_bt_EliminarSucursal",
                new { Id = id },
                commandType: CommandType.StoredProcedure);
            return rows > 0;
        }
    }
}
