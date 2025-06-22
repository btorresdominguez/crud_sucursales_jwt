using CRUDSucursales.Models;

namespace CRUDSucursales.Interfaces
{
    public interface IMonedaRepository
    {
        Task<IEnumerable<MonedaDto>> GetAllAsync();
    }
}