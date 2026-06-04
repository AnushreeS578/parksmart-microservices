package com.parksmart.parking_service.config;

import com.parksmart.parking_service.controller.ParkingController;
import com.parksmart.parking_service.entity.Parking;
import com.parksmart.parking_service.service.ParkingService;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.*;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ParkingController.class)
@Import({SecurityConfig.class, JwtFilter.class}) // 🔥 load security
class SecurityConfigTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ParkingService service;

    // ✅ ADMIN CAN ADD PARKING
    @Test
    @WithMockUser(roles = "ADMIN")
    void testAdminCanAddParking() throws Exception {

        when(service.addParking(any())).thenReturn(new Parking()); // 🔥 FIX

        mockMvc.perform(post("/parking")
                .contentType("application/json")
                .content("{\"location\":\"Bangalore\",\"totalSlots\":100,\"availableSlots\":50,\"pricePerHour\":50}"))
                .andExpect(status().isOk());
    }

    // ❌ USER CANNOT ADD PARKING
    @Test
    @WithMockUser(roles = "USER")
    void testUserCannotAddParking() throws Exception {

        mockMvc.perform(post("/parking"))
                .andExpect(status().isForbidden());
    }

    // ✅ USER CAN VIEW PARKING
    @Test
    @WithMockUser(roles = "USER")
    void testUserCanViewParking() throws Exception {

        when(service.getParking()).thenReturn(java.util.List.of());

        mockMvc.perform(get("/parking"))
                .andExpect(status().isOk());
    }

    // ❌ USER CANNOT DELETE
    @Test
    @WithMockUser(roles = "USER")
    void testUserCannotDeleteParking() throws Exception {

        mockMvc.perform(delete("/parking/1"))
                .andExpect(status().isForbidden());
    }

    // ✅ ADMIN CAN DELETE
    @Test
    @WithMockUser(roles = "ADMIN")
    void testAdminCanDeleteParking() throws Exception {

        mockMvc.perform(delete("/parking/1"))
                .andExpect(status().isOk());
    }

    
}