using Microsoft.AspNetCore.Identity;

namespace UserManagement.Api.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string PassportNumber { get; set; }
        public decimal Salary { get; set; }
    }
}
