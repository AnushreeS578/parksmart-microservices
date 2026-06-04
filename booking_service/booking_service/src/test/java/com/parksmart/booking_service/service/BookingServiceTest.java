package com.parksmart.booking_service.service;

import com.parksmart.booking_service.client.EmailClient;
import com.parksmart.booking_service.client.ParkingClient;
import com.parksmart.booking_service.dto.EmailRequestDTO;
import com.parksmart.booking_service.dto.ParkingDTO;
import com.parksmart.booking_service.entity.Booking;
import com.parksmart.booking_service.exception.BookingNotFoundException;
import com.parksmart.booking_service.repository.BookingRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BookingServiceTest {

    @Mock
    private BookingRepository repository;

    @Mock
    private ParkingClient parkingClient;

    @Mock
    private EmailClient emailClient;

    @InjectMocks
    private BookingService service;

    private Booking booking;

    @BeforeEach
    void setUp() {

        booking = new Booking();

        booking.setId(1L);

        booking.setParkingId(1L);

        booking.setSlotNumber(5);

        booking.setUserId(10L);

        booking.setStartTime(
                LocalDateTime.now()
        );

        booking.setEndTime(
                LocalDateTime.now().plusHours(2)
        );
    }

    // CREATE BOOKING SUCCESS
    @Test
    void testCreateBooking() {

        ParkingDTO parking =
                new ParkingDTO();

        parking.setId(1L);

        parking.setAvailableSlots(10);

        parking.setPricePerHour(50);

        when(repository
                .existsByParkingIdAndSlotNumberAndStatus(
                        anyLong(),
                        anyInt(),
                        anyString()
                )).thenReturn(false);

        when(parkingClient.getParkingById(1L))
                .thenReturn(parking);

        when(repository.save(any(Booking.class)))
                .thenReturn(booking);

        Booking result =
                service.createBooking(booking);

        assertNotNull(result);

        verify(repository, times(1))
                .save(any(Booking.class));

        verify(parkingClient, times(1))
                .reduceSlot(1L);

        verify(emailClient, times(1))
                .sendEmail(any(EmailRequestDTO.class));
    }

    // NULL BOOKING
    @Test
    void testCreateBooking_NullBooking() {

        RuntimeException ex =
                assertThrows(
                        RuntimeException.class,
                        () -> service.createBooking(null)
                );

        assertEquals(
                "Booking data is required",
                ex.getMessage()
        );
    }

    // INVALID PARKING ID
    @Test
    void testInvalidParkingId() {

        booking.setParkingId(0L);

        RuntimeException ex =
                assertThrows(
                        RuntimeException.class,
                        () -> service.createBooking(booking)
                );

        assertEquals(
                "Invalid parking ID",
                ex.getMessage()
        );
    }

    // SLOT ALREADY TAKEN
    @Test
    void testSlotAlreadyTaken() {

        when(repository
                .existsByParkingIdAndSlotNumberAndStatus(
                        anyLong(),
                        anyInt(),
                        eq("PENDING_PAYMENT")
                )).thenReturn(true);

        RuntimeException ex =
                assertThrows(
                        RuntimeException.class,
                        () -> service.createBooking(booking)
                );

        assertEquals(
                "Slot already taken ❌",
                ex.getMessage()
        );
    }

    // GET ALL BOOKINGS
    @Test
    void testGetBookings() {

        List<Booking> list =
                Arrays.asList(booking);

        when(repository.findAll())
                .thenReturn(list);

        List<Booking> result =
                service.getBookings();

        assertEquals(1, result.size());
    }

    // GET BOOKING BY ID
    @Test
    void testGetBookingById() {

        when(repository.findById(1L))
                .thenReturn(Optional.of(booking));

        Booking result =
                service.getBookingById(1L);

        assertNotNull(result);

        assertEquals(
                1L,
                result.getId()
        );
    }

    // BOOKING NOT FOUND
    @Test
    void testBookingNotFound() {

        when(repository.findById(1L))
                .thenReturn(Optional.empty());

        assertThrows(
                BookingNotFoundException.class,
                () -> service.getBookingById(1L)
        );
    }

    // INVALID BOOKING ID
    @Test
    void testInvalidBookingId() {

        RuntimeException ex =
                assertThrows(
                        RuntimeException.class,
                        () -> service.getBookingById(0L)
                );

        assertEquals(
                "Invalid booking ID",
                ex.getMessage()
        );
    }

    // CANCEL BOOKING
    @Test
    void testCancelBooking() {

        booking.setStatus("BOOKED");

        when(repository.findById(1L))
                .thenReturn(Optional.of(booking));

        service.cancelBooking(1L);

        verify(repository, times(1))
                .save(any(Booking.class));

        verify(parkingClient, times(1))
                .increaseSlot(1L);

        verify(emailClient, times(1))
                .sendEmail(any(EmailRequestDTO.class));
    }

    // ALREADY CANCELLED
    @Test
    void testAlreadyCancelledBooking() {

        booking.setStatus("CANCELLED");

        when(repository.findById(1L))
                .thenReturn(Optional.of(booking));

        RuntimeException ex =
                assertThrows(
                        RuntimeException.class,
                        () -> service.cancelBooking(1L)
                );

        assertEquals(
                "Booking already cancelled",
                ex.getMessage()
        );
    }

    // CANCEL BOOKING NOT FOUND
    @Test
    void testCancelBookingNotFound() {

        when(repository.findById(1L))
                .thenReturn(Optional.empty());

        assertThrows(
                BookingNotFoundException.class,
                () -> service.cancelBooking(1L)
        );
    }
}