package com.example.app // <-- PASTIKAN NAMA PAKET INI SESUAI DENGAN PROYEK ANDA

import android.util.Log
import com.google.firebase.messaging.FirebaseMessagingService
import com.google.firebase.messaging.RemoteMessage

class MyFirebaseMessagingService : FirebaseMessagingService() {

    private val TAG = "MyFirebaseMsgService"

    /**
     * Dipanggil saat aplikasi menerima pesan notifikasi ketika sedang berjalan di foreground.
     * Jika aplikasi di background, Firebase akan menampilkan notifikasi secara otomatis.
     */
    override fun onMessageReceived(remoteMessage: RemoteMessage) {
        super.onMessageReceived(remoteMessage)
        Log.d(TAG, "From: ${remoteMessage.from}")

        // Anda bisa mengambil data dari notifikasi di sini
        remoteMessage.notification?.let {
            Log.d(TAG, "Message Notification Title: ${it.title}")
            Log.d(TAG, "Message Notification Body: ${it.body}")
            // Jika Anda ingin menampilkan notifikasi custom saat aplikasi di foreground,
            // Anda bisa memanggil fungsi untuk membuat notifikasi di sini.
        }
    }

    /**
     * Dipanggil saat token registrasi perangkat baru dibuat atau diperbarui.
     * Token ini yang digunakan untuk mengirim notifikasi ke perangkat spesifik.
     * Anda harus mengirim token ini ke server backend Anda agar bisa digunakan.
     */
    override fun onNewToken(token: String) {
        super.onNewToken(token)
        Log.d(TAG, "Refreshed token: $token")

        // Di sini Anda bisa menambahkan logika untuk mengirim token ke server Anda.
        // sendRegistrationToServer(token)
    }
}