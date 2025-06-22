using System.ComponentModel.DataAnnotations;

namespace CRUDSucursales.Models
{
    public class Sucursal
    {
        public int Id { get; set; }

        [Required]
        public int Codigo { get; set; }

        [Required, MaxLength(250)]
        public string Descripcion { get; set; }

        [Required, MaxLength(250)]
        public string Direccion { get; set; }

        [Required, MaxLength(50)]
        public string Identificacion { get; set; }

        [Required]
        public DateTime FechaCreacion { get; set; }

        [Required]
        public int IdMoneda { get; set; }

        public string Moneda { get; set; }  // para lecturas con JOIN

        public bool Estado { get; set; }
    }
}
