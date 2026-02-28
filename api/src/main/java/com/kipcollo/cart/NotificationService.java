package com.kipcollo.cart;

import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    public void sendPendingCartNotification(String userName, int cartId) {
        // Replace with real email or push service if available
        System.out.println("🔔 Notify user " + userName + ": You have a pending cart (Cart ID: " + cartId + ")");
    }
}
