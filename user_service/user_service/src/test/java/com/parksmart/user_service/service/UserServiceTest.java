package com.parksmart.user_service.service;

import com.parksmart.user_service.client.AuthClient;
import com.parksmart.user_service.entity.User;
import com.parksmart.user_service.repository.UserRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository repository;

    @Mock
    private AuthClient authClient;

    @InjectMocks
    private UserService service;

    private User user;

    @BeforeEach
    void setup(){
        user = new User();
        user.setId(1L);
        user.setUsername("anu");
        user.setName("Anu");
        user.setEmail("anu@gmail.com");
        user.setPhone("9999999999");
        user.setPassword("123");
    }

    // ✅ CREATE USER SUCCESS
    @Test
    void testCreateUserSuccess(){

        when(authClient.validateUser("anu")).thenReturn("Valid user");
        when(repository.findByUsername("anu")).thenReturn(user);
        when(repository.existsByEmail("anu@gmail.com")).thenReturn(false);
        when(repository.save(any(User.class))).thenReturn(user);

        User result = service.createUser(user);

        assertEquals("Anu", result.getName());
    }

    // ❌ USER NOT REGISTERED
    @Test
    void testCreateUser_UserNotRegistered(){

        when(authClient.validateUser("anu")).thenReturn("Valid user");
        when(repository.findByUsername("anu")).thenReturn(null);

        assertThrows(RuntimeException.class,
                () -> service.createUser(user));
    }

    // ❌ EMAIL EXISTS
    @Test
    void testCreateUser_EmailExists(){

        when(authClient.validateUser("anu")).thenReturn("Valid user");
        when(repository.findByUsername("anu")).thenReturn(user);
        when(repository.existsByEmail("anu@gmail.com")).thenReturn(true);

        assertThrows(RuntimeException.class,
                () -> service.createUser(user));
    }

    // ✅ GET USER BY USERNAME
    @Test
    void testGetUserByUsernameSuccess(){

        when(repository.findByUsername("anu")).thenReturn(user);

        User result = service.getUserByUsername("anu");

        assertEquals("anu", result.getUsername());
    }

    // ❌ USER NOT FOUND
    @Test
    void testGetUserByUsernameFail(){

        when(repository.findByUsername("anu")).thenReturn(null);

        assertThrows(RuntimeException.class,
                () -> service.getUserByUsername("anu"));
    }

    // ✅ GET ALL USERS
    @Test
    void testGetUsers(){

        when(repository.findAll()).thenReturn(List.of(user));

        List<User> list = service.getUsers();

        assertEquals(1, list.size());
    }

    // ✅ GET USER BY ID
    @Test
    void testGetUserById(){

        when(repository.findById(1L)).thenReturn(Optional.of(user));

        User result = service.getUserById(1L);

        assertEquals("anu", result.getUsername());
    }

    // ❌ GET USER BY ID FAIL
    @Test
    void testGetUserByIdFail(){

        when(repository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class,
                () -> service.getUserById(1L));
    }

    // ✅ UPDATE USER
    @Test
    void testUpdateUser(){

        when(repository.findByUsername("anu")).thenReturn(user);
        when(repository.save(any(User.class))).thenReturn(user);

        User update = new User();
        update.setName("NewName");

        User result = service.updateUser("anu", update);

        assertEquals("NewName", result.getName());
    }

    // ❌ UPDATE FAIL
    @Test
    void testUpdateUserFail(){

        when(repository.findByUsername("anu")).thenReturn(null);

        assertThrows(RuntimeException.class,
                () -> service.updateUser("anu", user));
    }

    // ✅ DELETE USER
    @Test
    void testDeleteUser(){

        when(repository.findByUsername("anu")).thenReturn(user);
        doNothing().when(repository).delete(user);

        service.deleteUser("anu");

        verify(repository, times(1)).delete(user);
    }

    // ❌ DELETE FAIL
    @Test
    void testDeleteUserFail(){

        when(repository.findByUsername("anu")).thenReturn(null);

        assertThrows(RuntimeException.class,
                () -> service.deleteUser("anu"));
    }

    // ✅ RESET PASSWORD
    @Test
    void testResetPassword(){

        when(repository.findByUsername("anu")).thenReturn(user);
        when(repository.save(any(User.class))).thenReturn(user);

        service.resetPassword("anu", "999");

        assertEquals("999", user.getPassword());
    }

    // ❌ RESET PASSWORD FAIL
    @Test
    void testResetPasswordFail(){

        when(repository.findByUsername("anu")).thenReturn(null);

        assertThrows(RuntimeException.class,
                () -> service.resetPassword("anu", "123"));
    }
}