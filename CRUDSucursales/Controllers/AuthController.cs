using CRUDSucursales.Interfaces;
using CRUDSucursales.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace CRUDSucursales.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IUsuarioRepository _userRepo;
        private readonly TokenService _tokenService;

        public AuthController(IUsuarioRepository userRepo, IConfiguration config)
        {
            _userRepo = userRepo;
            _tokenService = new TokenService(config);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            // Verifica las credenciales del usuario
            var user = await _userRepo.GetUsuario(request.Username, request.Password);

            if (user == null)
                return Unauthorized("Usuario o contraseña inválidos");

            // Genera el token JWT
            var token = _tokenService.GenerateJwtToken(user);

            // Guarda el token en la base de datos (si es necesario)
            await _userRepo.InsertarToken(user.Id, token);

            return Ok(new
            {
                token,
                usuario = user.Username,
                roles = user.Roles
            });
        }
    }
}