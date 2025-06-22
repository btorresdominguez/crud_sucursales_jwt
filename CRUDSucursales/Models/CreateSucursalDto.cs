namespace CRUDSucursales.Models
{
    public class CreateSucursalDto
    {
        public int Codigo { get; set; }
        public string Descripcion { get; set; }
        public string Direccion { get; set; }
        public string Identificacion { get; set; }
        public DateTime FechaCreacion { get; set; }
        public int IdMoneda { get; set; }
    }

}
