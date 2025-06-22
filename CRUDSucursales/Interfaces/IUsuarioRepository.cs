using CRUDSucursales.Models;
using System.Threading.Tasks;

namespace CRUDSucursales.Interfaces
{
    public interface IUsuarioRepository
    {
        Task<Usuario?> GetUsuario(string username, string password);
        Task InsertarToken(int idUsuario, string token);
    }


}
