package com.parksmart.user_service.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.parksmart.user_service.client.AuthClient;
import com.parksmart.user_service.entity.User;
import com.parksmart.user_service.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository repository;

    @Autowired
    private AuthClient authClient;

    public User createUser(User user){

        // validate user via auth service
        authClient.validateUser(user.getUsername());

        User existingUser = repository.findByUsername(user.getUsername());

        if(existingUser == null){
            throw new RuntimeException("User not registered");
        }

        if(repository.existsByEmail(user.getEmail())){
            throw new RuntimeException("Email already exists");
        }

        existingUser.setName(user.getName());
        existingUser.setEmail(user.getEmail());
        existingUser.setPhone(user.getPhone());

        return repository.save(existingUser);
    }
    
    public User getUserByUsername(String username){

        User user = repository.findByUsername(username);

        if(user == null){
            throw new RuntimeException("User not found");
        }

        return user;
    }

    public List<User> getUsers(){
        return repository.findAll();
    }
    
    public User getUserById(Long id){
        return repository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User updateUser(String username, User user){

        User existingUser = repository.findByUsername(username);

        if(existingUser == null){
            throw new RuntimeException("User not found");
        }

        if(user.getName()!=null) existingUser.setName(user.getName());
        if(user.getEmail()!=null) existingUser.setEmail(user.getEmail());
        if(user.getPhone()!=null) existingUser.setPhone(user.getPhone());

        return repository.save(existingUser);
    }

    public void deleteUser(String username){

        User existingUser = repository.findByUsername(username);

        if(existingUser == null){
            throw new RuntimeException("User not found");
        }

        repository.delete(existingUser);
    }
    
    public void resetPassword(String username, String newPassword) {

        User user = repository.findByUsername(username);

        if (user == null) {
            throw new RuntimeException("User not found");
        }

        user.setPassword(newPassword);
        repository.save(user);
    }
}