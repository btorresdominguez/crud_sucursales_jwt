using CRUDSucursales.Interfaces;
using CRUDSucursales.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CRUDSucursales.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]  
    public class SucursalesController : ControllerBase
    {
        private readonly ISucursalRepository _repo;

        public SucursalesController(ISucursalRepository repo)
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
                return StatusCode(500, "Error al obtener las sucursales.");
            }
        }

        [HttpGet("{codigo:int}", Name = "GetByCodigo")]
        public async Task<IActionResult> GetByCodigo(int codigo)
        {
            try
            {
                var suc = await _repo.GetByCodigoAsync(codigo); // Cambiado de GetByIdAsync a GetByCodigoAsync  
                if (suc == null) return NotFound($"No existe sucursal con código = {codigo}");
                return Ok(suc);
            }
            catch (Exception ex)
            {
                // Log(ex);  
                return StatusCode(500, "Error al obtener la sucursal.");
            }
        }

 

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateSucursalDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            if (dto.FechaCreacion.Date < DateTime.UtcNow.Date)
                return BadRequest("La fecha de creación no puede ser anterior a hoy.");

            var sucursal = new Sucursal
            {
                Codigo = dto.Codigo,
                Descripcion = dto.Descripcion,
                Direccion = dto.Direccion,
                Identificacion = dto.Identificacion,
                FechaCreacion = dto.FechaCreacion,
                IdMoneda = dto.IdMoneda,
                Estado = true
            };

            var newId = await _repo.CreateAsync(sucursal);
            sucursal.Codigo = newId;

            return Ok(new { message = "Sucursal creada correctamente.", id = newId });
        }

        [HttpPut("{codigo}")]
        public async Task<IActionResult> Update(int codigo, [FromBody] UpdateSucursalDto dto)
        {
            try
            {
                // Verifica el estado del modelo  
                if (!ModelState.IsValid) return BadRequest(ModelState);

                // Verifica que el código de la ruta coincida con el del DTO  
                if (codigo != dto.Codigo) return BadRequest("El código de la ruta no coincide con el cuerpo.");

                // Verifica la fecha de creación  
                if (dto.FechaCreacion.Date < DateTime.UtcNow.Date)
                    return BadRequest("La fecha de creación no puede ser anterior a hoy.");

                // Busca la sucursal existente por código  
                var existingSucursal = await _repo.GetByCodigoAsync(codigo);
                if (existingSucursal == null) return NotFound($"No existe sucursal con código = {codigo}");

                // Actualiza los detalles de la sucursal  
                existingSucursal.Descripcion = dto.Descripcion;
                existingSucursal.Direccion = dto.Direccion;
                existingSucursal.Identificacion = dto.Identificacion;
                existingSucursal.FechaCreacion = dto.FechaCreacion;
                existingSucursal.IdMoneda = dto.IdMoneda;
                existingSucursal.Estado = dto.Estado;

                // Llama al procedimiento almacenado  
                var rowsAffected = await _repo.UpdateAsync(existingSucursal);

                if (rowsAffected == 0)
                {
                    // No se actualizó nada (puede ser que no había cambios o algo falló)  
                    return NotFound($"No se pudo actualizar la sucursal con código = {codigo} (sin cambios o no encontrada).");
                }

                // Si al menos una fila fue actualizada:  
                return NoContent();
            }
            catch (Exception ex)
            {
                // Log the exception (implement your logging logic here)  
                Console.WriteLine($"Error actualizando la sucursal: {ex.Message}");

                return StatusCode(500, "Error al actualizar la sucursal.");
            }
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var deleted = await _repo.DeleteAsync(id);

               // Si eliminó: devuelve Ok con un mensaje
                return Ok(new { message = "Sucursal eliminada correctamente." });
            }
            catch (Exception ex)
            {
                // Log(ex)
                return StatusCode(500, "Error al eliminar la sucursal.");
            }
        }


    }
}
