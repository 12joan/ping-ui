#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

#[tauri::command]
fn begin_ping(host: &str) -> String {
    format!("Pinging {}", host)
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![begin_ping])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
