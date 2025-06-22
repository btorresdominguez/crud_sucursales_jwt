using CRUDSucursales.Interfaces;
using CRUDSucursales.Models;
using Dapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Data.SqlClient;
using System.Data;

namespace CRUDSucursales.Repositories
{
    public class MonedaRepository : IMonedaRepository
    {
        private readonly IConfiguration _config;
        private readonly string _connStr;

        public MonedaRepository(IConfiguration config)
        {
            _config = config;
            _connStr = _config.GetConnectionString("DefaultConnection");
        }

        public async Task<IEnumerable<MonedaDto>> GetAllAsync()
        {
            const string sql = @"
                SELECT Id, Codigo, Descripcion 
                FROM bt_mon_moneda
                WHERE Estado = 1
                ORDER BY Codigo;
            ";

            await using var conn = new SqlConnection(_connStr);
            return await conn.QueryAsync<MonedaDto>(sql, commandType: CommandType.Text);
        }
    }
}
