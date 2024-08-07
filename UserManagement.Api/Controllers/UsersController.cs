using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using UserManagement.Api.Models;
using Microsoft.EntityFrameworkCore;

[Route("api/[controller]")]
[ApiController]
public class UsersController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;

    public UsersController(UserManager<ApplicationUser> userManager)
    {
        _userManager = userManager;
    }

    [HttpGet]
    public async Task<IActionResult> GetUsers()
    {
        var users = await _userManager.Users.Select(u => new
        {
            u.UserName,
            u.PhoneNumber
        }).ToListAsync();
        return Ok(users);
    }

    [HttpGet("{id}")]
    [Authorize(Policy = "RequireAdministratorRole")]
    public async Task<IActionResult> GetUserDetails(string id)
    {
        var user = await _userManager.FindByIdAsync(id);
        if (user == null)
        {
            return NotFound();
        }

        var userDetails = new
        {
            user.UserName,
            user.PhoneNumber,
            user.PassportNumber,
            user.Salary
        };

        return Ok(userDetails);
    }
}
