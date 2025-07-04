import android.os.Bundle;
import android.util.Log;
import androidx.annotation.NonNull;
import com.getcapacitor.BridgeActivity; // Pastikan ini sesuai dengan kelas induk Anda
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.messaging.FirebaseMessaging;


public class MainActivity extends BridgeActivity {

  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    // Kode untuk mengambil token FCM secara manual
    FirebaseMessaging.getInstance().getToken()
      .addOnCompleteListener(new OnCompleteListener<String>() {
        @Override
        public void onComplete(@NonNull Task<String> task) {
          if (!task.isSuccessful()) {
            Log.w("FCM_TOKEN", "Fetching FCM registration token failed", task.getException());
            return;
          }

          // Dapatkan token baru
          String token = task.getResult();

          // Log token
          Log.d("FCM_TOKEN", "Manual fetch token: " + token);
        }
      });
  }
}