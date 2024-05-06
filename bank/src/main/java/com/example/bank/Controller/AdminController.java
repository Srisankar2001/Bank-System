package com.example.bank.Controller;

import com.example.bank.Config.Response;
import com.example.bank.Dto.AdminDto;
import com.example.bank.Dto.AdminSignupDto;
import com.example.bank.Service.AdminService;
import com.example.bank.Service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/admin")
public class AdminController {
    @Autowired
    AdminService adminService;
    @Autowired
    AuthService authService;

    @PostMapping("/block")
    public Response<?> blockUser(@RequestBody AdminDto adminDto){
        return adminService.blockUser(adminDto.getUserId());
    }

    @PostMapping("/unblock")
    public Response<?> unblockUser(@RequestBody AdminDto adminDto){
        return adminService.unblockUser(adminDto.getUserId());
    }

    @PostMapping("/register")
    public Response<?> adminRegister(@RequestBody AdminSignupDto adminSignupDto){
        if(!authService.isEmailUnique(adminSignupDto.getEmail())){
            return Response.builder()
                    .status(false)
                    .error("Email already exist")
                    .build();
        }
        else{
            return authService.adminRegister(adminSignupDto);
        }
    }

    @GetMapping("/getUsers")
    public Response<?> getAllUsers(){
        return adminService.getAllUsers();
    }
    public Response<?> getAllBlockedUsers(){
        return adminService.getAllBlockedUsers();
    }
    public Response<?> getAllUnblockedUsers(){
        return adminService.getAllUnblockedUsers();
    }

    @GetMapping("/getAdmins")
    public Response<?> getAllAdmins(){
        return adminService.getAllAdmins();
    }
}
