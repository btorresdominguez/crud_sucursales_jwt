using CRUDSucursales.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CRUDSucursales.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    //[Authorize(Roles = "Admin")]
    public class MonedasController : ControllerBase
    {
        private readonly IMonedaRepository _repo;

        public MonedasController(IMonedaRepository repo)
        {
            _repo = repo;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var list = await _repo.GetAllAsync();
                return Ok(list);
            }
            catch (Exception ex)
            {
                // Log(ex);
                return StatusCode(500, "Error al obtener las monedas.");
            }
        }
    }
}
