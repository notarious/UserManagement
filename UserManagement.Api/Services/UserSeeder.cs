using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Threading.Tasks;
using UserManagement.Api.Models;

namespace UserManagement.Api
{
    public static class UserSeeder
    {
        public static async Task SeedAsync(IServiceProvider serviceProvider)
        {
            var userManager = serviceProvider.GetRequiredService<UserManager<ApplicationUser>>();
            var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();

            string[] roleNames = { "Administrator", "User" };
            IdentityResult roleResult;

            foreach (var roleName in roleNames)
            {
                var roleExist = await roleManager.RoleExistsAsync(roleName);
                if (!roleExist)
                {
                    roleResult = await roleManager.CreateAsync(new IdentityRole(roleName));
                    Console.WriteLine($"Role {roleName} created");
                }
            }

            var adminUser = new ApplicationUser
            {
                UserName = "admin",
                Email = "admin@example.com",
                PhoneNumber = "1234567890",
                Salary = 5000.00M,
                PassportNumber = "123456789"
            };

            string adminPassword = "Admin@123";

            var user = await userManager.FindByEmailAsync(adminUser.Email);

            if (user == null)
            {
                var createPowerUser = await userManager.CreateAsync(adminUser, adminPassword);
                if (createPowerUser.Succeeded)
                {
                    await userManager.AddToRoleAsync(adminUser, "Administrator");
                    Console.WriteLine("Admin user created and role assigned");
                }
                else
                {
                    foreach (var error in createPowerUser.Errors)
                    {
                        Console.WriteLine($"Error: {error.Description}");
                    }
                }
            }
            else
            {
                Console.WriteLine("Admin user already exists");
            }
        }
    }
}
