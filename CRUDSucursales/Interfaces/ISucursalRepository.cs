using CRUDSucursales.Models;

namespace CRUDSucursales.Interfaces
{
    public interface ISucursalRepository
    {
        Task<IEnumerable<Sucursal>> GetAllAsync();
        Task<Sucursal?> GetByCodigoAsync(int id);
        Task<int> CreateAsync(Sucursal sucursal);
        Task<int> UpdateAsync(Sucursal sucursal);
        Task<bool> DeleteAsync(int id);
    }
}
