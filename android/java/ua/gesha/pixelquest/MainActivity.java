package ua.gesha.pixelquest;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.DialogInterface;
import android.graphics.Color;
import android.os.Bundle;
import android.view.View;
import android.view.WindowManager;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

/** Offline wrapper: all game files are bundled under android_asset/game. */
public final class MainActivity extends Activity {
    private WebView game;
    private static final String GAME_URL = "file:///android_asset/game/index.html";

    @Override public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        game = new WebView(this);
        game.setBackgroundColor(Color.rgb(13, 26, 43));
        game.setOverScrollMode(View.OVER_SCROLL_NEVER);
        WebSettings settings = game.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setAllowFileAccess(false); // android_asset remains accessible.
        settings.setAllowContentAccess(false);
        settings.setAllowFileAccessFromFileURLs(false);
        settings.setAllowUniversalAccessFromFileURLs(false);
        settings.setMediaPlaybackRequiresUserGesture(true);
        settings.setSupportZoom(false);
        settings.setBuiltInZoomControls(false);
        settings.setDisplayZoomControls(false);
        settings.setUseWideViewPort(true);
        settings.setLoadWithOverviewMode(true);
        game.setWebChromeClient(new WebChromeClient());
        game.setWebViewClient(new WebViewClient() {
            @Override public boolean shouldOverrideUrlLoading(WebView view, String url) {
                return !url.startsWith("file:///android_asset/game/");
            }
            @Override public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                return !request.getUrl().toString().startsWith("file:///android_asset/game/");
            }
        });
        setContentView(game);
        immersive();
        game.loadUrl(GAME_URL);
    }

    private void immersive() {
        getWindow().getDecorView().setSystemUiVisibility(
            View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY | View.SYSTEM_UI_FLAG_FULLSCREEN
            | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION | View.SYSTEM_UI_FLAG_LAYOUT_STABLE
            | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION);
    }

    private void pauseGame() {
        if (game != null) game.evaluateJavascript("window.dispatchEvent(new Event('blur'));", null);
    }

    @Override public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        if (hasFocus) immersive();
    }

    @Override protected void onPause() {
        pauseGame();
        if (game != null) { game.onPause(); game.pauseTimers(); }
        super.onPause();
    }

    @Override protected void onResume() {
        super.onResume();
        if (game != null) { game.resumeTimers(); game.onResume(); }
        immersive();
    }

    @Override public void onBackPressed() {
        pauseGame();
        new AlertDialog.Builder(this).setTitle("PIXEL QUEST")
            .setMessage("Exit the game? Your checkpoint is saved.")
            .setNegativeButton("CANCEL", null)
            .setPositiveButton("EXIT", new DialogInterface.OnClickListener() {
                @Override public void onClick(DialogInterface dialog, int which) { finish(); }
            }).show();
    }

    @Override protected void onDestroy() {
        if (game != null) { game.stopLoading(); game.destroy(); game = null; }
        super.onDestroy();
    }
}
