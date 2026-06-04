package com.parksmart.user_service.controller;

import com.fasterxml.jackson.databind.ObjectMapper;

import com.parksmart.user_service.dto.UserRequestDTO;
import com.parksmart.user_service.entity.User;
import com.parksmart.user_service.service.UserService;

import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;

import org.springframework.boot.test.mock.mockito.MockBean;

import org.springframework.http.MediaType;

import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;

import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(UserController.class)
@AutoConfigureMockMvc(addFilters = false)
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService service;

    @Autowired
    private ObjectMapper mapper;

    // GET USER BY USERNAME
    @Test
    void testGetUserByUsername() throws Exception {

        User user = new User();

        user.setId(1L);
        user.setUsername("anu");
        user.setName("Anushree");
        user.setEmail("anu@gmail.com");
        user.setPhone("7865434566");
        user.setRole("USER");

        when(service.getUserByUsername("anu"))
                .thenReturn(user);

        mockMvc.perform(
                get("/users/username/anu")
        )
        .andExpect(status().isOk());
    }

    // GET ALL USERS
    @Test
    void testGetUsers() throws Exception {

        User user1 = new User();

        user1.setUsername("anu");
        user1.setName("Anushree");

        User user2 = new User();

        user2.setUsername("john");
        user2.setName("John");

        List<User> users =
                Arrays.asList(user1, user2);

        when(service.getUsers())
                .thenReturn(users);

        mockMvc.perform(
                get("/users")
        )
        .andExpect(status().isOk());
    }

    // UPDATE USER
    @Test
    void testUpdateUser() throws Exception {

        UserRequestDTO dto =
                new UserRequestDTO();

        dto.setUsername("anu");
        dto.setPassword("anu123");
        dto.setEmail("anu@gmail.com");
        dto.setRole("USER");
        dto.setName("Anushree");
        dto.setPhone("7865434566");

        User updatedUser = new User();

        updatedUser.setUsername("anu");
        updatedUser.setName("Anushree");
        updatedUser.setEmail("anu@gmail.com");
        updatedUser.setPhone("7865434566");

        when(service.updateUser(
                eq("anu"),
                any(User.class)
        )).thenReturn(updatedUser);

        mockMvc.perform(

                put("/users/anu")

                .contentType(
                        MediaType.APPLICATION_JSON
                )

                .content(
                        mapper.writeValueAsString(dto)
                )
        )
        .andExpect(status().isOk());
    }

    // DELETE USER
    @Test
    void testDeleteUser() throws Exception {

        doNothing().when(service)
                .deleteUser("anu");

        mockMvc.perform(
                delete("/users/anu")
        )
        .andExpect(status().isOk());
    }

    // RESET PASSWORD
    @Test
    void testResetPassword() throws Exception {

        UserRequestDTO dto =
                new UserRequestDTO();

        dto.setUsername("anu");
        dto.setPassword("newpass123");
        dto.setEmail("anu@gmail.com");
        dto.setRole("USER");
        dto.setName("Anushree");
        dto.setPhone("7865434566");

        doNothing().when(service)
                .resetPassword(
                        "anu",
                        "newpass123"
                );

        mockMvc.perform(

                put("/users/reset-password/anu")

                .contentType(
                        MediaType.APPLICATION_JSON
                )

                .content(
                        mapper.writeValueAsString(dto)
                )
        )
        .andExpect(status().isOk());
    }
}