package com.parksmart.booking_service.service;

import com.parksmart.booking_service.entity.Booking;
import com.parksmart.booking_service.repository.BookingRepository;
import com.parksmart.booking_service.exception.BookingNotFoundException;
import com.parksmart.booking_service.client.ParkingClient;
import com.parksmart.booking_service.dto.ParkingDTO;

import org.springframework.stereotype.Service;
import com.parksmart.booking_service.client.EmailClient;
import com.parksmart.booking_service.dto.EmailRequestDTO;
import java.time.Duration;
import java.util.List;

@Service
public class BookingService {

    private final BookingRepository repository;

    private final ParkingClient parkingClient;
    
    private final EmailClient emailClient;

    public BookingService(
            BookingRepository repository,
            ParkingClient parkingClient,
            EmailClient emailClient) {

        this.repository = repository;

        this.parkingClient = parkingClient;

        this.emailClient = emailClient;
    }

 // CREATE BOOKING
    public Booking createBooking(
            Booking booking) {

        // VALIDATION
        if (booking == null) {

            throw new IllegalArgumentException(
                    "Booking data is required"
            );
        }

        if (booking.getParkingId() == null
                || booking.getParkingId() <= 0) {

            throw new IllegalArgumentException(
                    "Invalid parking ID"
            );
        }

        if (booking.getSlotNumber() <= 0) {

            throw new IllegalArgumentException(
                    "Invalid slot number"
            );
        }

        if (booking.getStartTime() == null
                || booking.getEndTime() == null) {

            throw new IllegalArgumentException(
                    "Start and End time required"
            );
        }

        if (booking.getStartTime()
                .isAfter(
                        booking.getEndTime()
                )) {

            throw new IllegalArgumentException(
                    "Start time must be before end time"
            );
        }

        // CHECK SLOT ALREADY BOOKED
        boolean slotExists =
                repository
                        .existsByParkingIdAndSlotNumberAndStatus(
                                booking.getParkingId(),
                                booking.getSlotNumber(),
                                "PENDING_PAYMENT"
                        );

        boolean bookedSlotExists =
                repository
                        .existsByParkingIdAndSlotNumberAndStatus(
                                booking.getParkingId(),
                                booking.getSlotNumber(),
                                "BOOKED"
                        );

        if (slotExists || bookedSlotExists) {

            throw new IllegalArgumentException(
                    "Slot already taken ❌"
            );
        }

        // FETCH PARKING
        ParkingDTO parking =
                parkingClient.getParkingById(
                        booking.getParkingId()
                );

        // PARKING VALIDATION
        if (parking == null) {

            throw new IllegalArgumentException(
                    "Parking not found"
            );
        }

        if (parking.getAvailableSlots() <= 0) {

            throw new IllegalArgumentException(
                    "No slots available ❌"
            );
        }

        if (parking.getPricePerHour() <= 0) {

            throw new IllegalArgumentException(
                    "Invalid parking price"
            );
        }

        // CALCULATE DURATION
        long minutes =
                Duration.between(
                        booking.getStartTime(),
                        booking.getEndTime()
                ).toMinutes();

        long hours =
                (long) Math.ceil(
                        minutes / 60.0
                );

        if (hours <= 0) {

            throw new IllegalArgumentException(
                    "Invalid booking duration"
            );
        }

        // TOTAL AMOUNT
        double pricePerHour =
                parking.getPricePerHour();

        double amount =
                hours * pricePerHour;

        booking.setAmount(amount);

        // STATUS
        booking.setStatus(
                "PENDING_PAYMENT"
        );

        // DEBUG LOGS
        System.out.println(
                "HOURS = " + hours
        );

        System.out.println(
                "PRICE = " + pricePerHour
        );

        System.out.println(
                "TOTAL = " + amount
        );

        // REDUCE SLOT
        parkingClient.reduceSlot(
                booking.getParkingId()
        );

        // SAVE BOOKING
        Booking savedBooking =
                repository.save(booking);

        // SEND BOOKING EMAIL
        try {

            EmailRequestDTO email =
                    new EmailRequestDTO();

            email.setTo(
                    "anushrees7176@gmail.com"
            );

            email.setSubject(
                    "ParkSmart Booking Confirmed"
            );

            email.setMessage(

                    "🚗 Booking Confirmed Successfully ✅\n\n"

                    + "Booking ID: "
                    + savedBooking.getId()

                    + "\nSlot Number: "
                    + savedBooking.getSlotNumber()

                    + "\nAmount: ₹"
                    + savedBooking.getAmount()

                    + "\nStatus: "
                    + savedBooking.getStatus()

                    + "\n\nPayment is still pending ⏳"

                    + "\nPlease complete payment to confirm booking fully."
            );

            emailClient.sendEmail(email);

        } catch (Exception e) {

            System.out.println(
                    "Booking Email Failed: "
                            + e.getMessage()
            );
        }

        return savedBooking;
    }

    // GET ALL BOOKINGS
    public List<Booking> getBookings() {

        return repository.findAll();
    }

    // GET BOOKING BY ID
    public Booking getBookingById(
            Long id) {

        if (id == null || id <= 0) {

            throw new IllegalArgumentException(
                    "Invalid booking ID"
            );
        }

        return repository.findById(id)
                .orElseThrow(() ->
                        new BookingNotFoundException(
                                "Booking not found"
                        )
                );
    }

 // CANCEL BOOKING

    public void cancelBooking(Long id){

        // VALIDATION

        if(id == null || id <= 0){

            throw new IllegalArgumentException(
                "Invalid booking ID"
            );
        }

        Booking booking =
            repository.findById(id)
            .orElseThrow(() ->
                new BookingNotFoundException(
                    "Booking not found"
                )
            );

        // ALREADY CANCELLED

        if("CANCELLED".equals(
                booking.getStatus())){

            throw new IllegalArgumentException(
                "Booking already cancelled"
            );
        }

        // UPDATE STATUS

        booking.setStatus("CANCELLED");

        repository.save(booking);

        // RESTORE SLOT

        parkingClient.increaseSlot(
            booking.getParkingId()
        );

        // EMAIL SERVICE

        try {

            EmailRequestDTO email =
                new EmailRequestDTO();

            email.setTo(
                "anushrees7176@gmail.com"
            );

            email.setSubject(
                "ParkSmart Booking Cancelled"
            );

            email.setMessage(

                "Booking Cancelled Successfully\n\n" +

                "Booking ID: " +
                booking.getId() +

                "\nSlot Number: " +
                booking.getSlotNumber() +

                "\nAmount: ₹" +
                booking.getAmount() +

                "\nStatus: " +
                booking.getStatus()
            );

            emailClient.sendEmail(email);

        } catch (Exception e){

            System.out.println(
                "Email Failed: " +
                e.getMessage()
            );
        }
    
    }
}