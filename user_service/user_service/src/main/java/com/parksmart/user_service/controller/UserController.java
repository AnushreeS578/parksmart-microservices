package com.parksmart.user_service.controller;

import com.parksmart.user_service.dto.UserRequestDTO;
import com.parksmart.user_service.entity.User;
import com.parksmart.user_service.service.UserService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService service;

    public UserController(
            UserService service) {

        this.service = service;
    }

    @GetMapping("/username/{username}")
    public User getUserByUsername(
            @PathVariable String username) {

        return service.getUserByUsername(
                username
        );
    }

    @GetMapping
    public List<User> getUsers() {

        return service.getUsers();
    }

    @PutMapping("/{username}")
    public User updateUser(

            @PathVariable String username,

            @Valid
            @RequestBody
            UserRequestDTO dto) {

        User user = new User();

        user.setUsername(dto.getUsername());

        user.setEmail(dto.getEmail());

        user.setPassword(dto.getPassword());

        user.setRole(dto.getRole());

        user.setName(dto.getName());

        user.setPhone(dto.getPhone());

        return service.updateUser(
                username,
                user
        );
    }

    @DeleteMapping("/{username}")
    public String deleteUser(
            @PathVariable String username) {

        service.deleteUser(username);

        return "User deleted successfully";
    }

    @PutMapping("/reset-password/{username}")
    public String resetPassword(

            @PathVariable String username,

            @Valid
            @RequestBody
            UserRequestDTO dto) {

        service.resetPassword(
                username,
                dto.getPassword()
        );

        return "Password updated successfully";
    }
}