package com.parksmart.parking_service.controller;

import com.fasterxml.jackson.databind.ObjectMapper;

import com.parksmart.parking_service.dto.ParkingRequestDTO;
import com.parksmart.parking_service.entity.Parking;
import com.parksmart.parking_service.service.ParkingService;

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
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ParkingController.class)
@AutoConfigureMockMvc(addFilters = false)
class ParkingControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ParkingService service;

    @Autowired
    private ObjectMapper mapper;

    // ADD PARKING
    @Test
    void testAddParking()
            throws Exception {

        ParkingRequestDTO dto =
                new ParkingRequestDTO();

        dto.setLocation("Bangalore");

        dto.setTotalSlots(100);

        dto.setAvailableSlots(80);

        dto.setPricePerHour(50);

        Parking parking =
                new Parking();

        parking.setId(1L);

        parking.setLocation("Bangalore");

        parking.setTotalSlots(100);

        parking.setAvailableSlots(80);

        parking.setPricePerHour(50);

        when(service.addParking(any()))
                .thenReturn(parking);

        mockMvc.perform(

                post("/parking")

                .contentType(
                        MediaType.APPLICATION_JSON
                )

                .content(
                        mapper.writeValueAsString(dto)
                )

        ).andExpect(status().isOk());
    }

    // GET ALL
    @Test
    void testGetParking()
            throws Exception {

        Parking parking =
                new Parking();

        parking.setId(1L);

        parking.setLocation("Mumbai");

        List<Parking> list =
                Arrays.asList(parking);

        when(service.getParking())
                .thenReturn(list);

        mockMvc.perform(
                get("/parking")
        ).andExpect(status().isOk());
    }

    // GET BY ID
    @Test
    void testGetParkingById()
            throws Exception {

        Parking parking =
                new Parking();

        parking.setId(1L);

        parking.setLocation("Delhi");

        when(service.getParkingById(1L))
                .thenReturn(parking);

        mockMvc.perform(
                get("/parking/1")
        ).andExpect(status().isOk());
    }

    // UPDATE PARKING
    @Test
    void testUpdateParking()
            throws Exception {

        ParkingRequestDTO dto =
                new ParkingRequestDTO();

        dto.setLocation("Chennai");

        dto.setTotalSlots(50);

        dto.setAvailableSlots(40);

        dto.setPricePerHour(30);

        Parking parking =
                new Parking();

        parking.setId(1L);

        parking.setLocation("Chennai");

        when(service.updateParking(
                any(Long.class),
                any(Parking.class)
        )).thenReturn(parking);

        mockMvc.perform(

                put("/parking/1")

                .contentType(
                        MediaType.APPLICATION_JSON
                )

                .content(
                        mapper.writeValueAsString(dto)
                )

        ).andExpect(status().isOk());
    }

    // REDUCE SLOT
    @Test
    void testReduceSlot()
            throws Exception {

        doNothing().when(service)
                .reduceSlot(1L);

        mockMvc.perform(
                put("/parking/reduce/1")
        ).andExpect(status().isOk());
    }

    // INCREASE SLOT
    @Test
    void testIncreaseSlot()
            throws Exception {

        doNothing().when(service)
                .increaseSlot(1L);

        mockMvc.perform(
                put("/parking/increase/1")
        ).andExpect(status().isOk());
    }

    // DELETE PARKING
    @Test
    void testDeleteParking()
            throws Exception {

        doNothing().when(service)
                .deleteParking(1L);

        mockMvc.perform(
                delete("/parking/1")
        ).andExpect(status().isOk());
    }
}