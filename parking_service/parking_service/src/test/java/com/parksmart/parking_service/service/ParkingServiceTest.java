package com.parksmart.parking_service.service;

import com.parksmart.parking_service.entity.Parking;
import com.parksmart.parking_service.repository.ParkingRepository;
import com.parksmart.parking_service.exception.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ParkingServiceTest {

    @Mock
    private ParkingRepository repository;

    @InjectMocks
    private ParkingService service;

    private Parking parking;

    @BeforeEach
    void setup(){
        MockitoAnnotations.openMocks(this);

        parking = new Parking();
        parking.setId(1L);
        parking.setLocation("Bangalore");
        parking.setTotalSlots(100);
        parking.setAvailableSlots(50);
    }

    // ✅ ADD PARKING SUCCESS
    @Test
    void testAddParkingSuccess(){
        when(repository.existsByLocation("Bangalore")).thenReturn(false);
        when(repository.save(parking)).thenReturn(parking);

        Parking result = service.addParking(parking);

        assertEquals("Bangalore", result.getLocation());
    }

    // ❌ DUPLICATE LOCATION
    @Test
    void testAddParkingAlreadyExists(){
        when(repository.existsByLocation("Bangalore")).thenReturn(true);

        assertThrows(ParkingAlreadyExistException.class,
                () -> service.addParking(parking));
    }

    // ✅ GET BY ID SUCCESS
    @Test
    void testGetParkingByIdSuccess(){
        when(repository.findById(1L)).thenReturn(Optional.of(parking));

        Parking result = service.getParkingById(1L);

        assertEquals("Bangalore", result.getLocation());
    }

    // ❌ NOT FOUND
    @Test
    void testGetParkingByIdFail(){
        when(repository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ParkingNotFoundException.class,
                () -> service.getParkingById(1L));
    }

    // ✅ GET ALL
    @Test
    void testGetParking(){
        when(repository.findAll()).thenReturn(List.of(parking));

        List<Parking> list = service.getParking();

        assertEquals(1, list.size());
    }

    // ✅ UPDATE SUCCESS
    @Test
    void testUpdateParking(){
        when(repository.findById(1L)).thenReturn(Optional.of(parking));
        when(repository.save(any(Parking.class))).thenReturn(parking);

        Parking updated = new Parking();
        updated.setLocation("Chennai");
        updated.setTotalSlots(200);
        updated.setAvailableSlots(150);

        Parking result = service.updateParking(1L, updated);

        assertEquals("Chennai", result.getLocation());
    }

    // ❌ UPDATE NOT FOUND
    @Test
    void testUpdateParkingFail(){
        when(repository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ParkingNotFoundException.class,
                () -> service.updateParking(1L, new Parking()));
    }

    // ✅ REDUCE SLOT SUCCESS
    @Test
    void testReduceSlot(){
        when(repository.findById(1L)).thenReturn(Optional.of(parking));

        service.reduceSlot(1L);

        assertEquals(49, parking.getAvailableSlots());
    }

    // ❌ NO SLOT AVAILABLE
    @Test
    void testReduceSlotFail(){
        parking.setAvailableSlots(0);
        when(repository.findById(1L)).thenReturn(Optional.of(parking));

        assertThrows(IllegalStateException.class,
                () -> service.reduceSlot(1L));
    }

    // ✅ INCREASE SLOT
    @Test
    void testIncreaseSlot(){
        when(repository.findById(1L)).thenReturn(Optional.of(parking));

        service.increaseSlot(1L);

        assertEquals(51, parking.getAvailableSlots());
    }

    // ✅ DELETE SUCCESS
    @Test
    void testDeleteParking(){
        when(repository.findById(1L)).thenReturn(Optional.of(parking));

        service.deleteParking(1L);

        verify(repository).delete(parking);
    }

    // ❌ DELETE FAIL
    @Test
    void testDeleteParkingFail(){
        when(repository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ParkingNotFoundException.class,
                () -> service.deleteParking(1L));
    }
}