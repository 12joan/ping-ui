#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use std::io::{BufRead, BufReader};
use std::process::{Child, Command, Stdio};
use tauri::Window;

static mut PING: Option<Child> = None;

#[tauri::command]
async fn start_ping(host: String, window: Window) -> Result<String, String> {
    unsafe {
        if PING.is_some() {
            return Err("Already pinging".to_string());
        }

        let mut command = Command::new("ping");
        command.args(&["--", &host]);
        command.stdout(Stdio::piped());
        command.stderr(Stdio::piped());

        let child = match command.spawn() {
            Ok(child) => child,
            Err(_) => return Err("Failed to start ping".to_string()),
        };

        PING = Some(child);

        let stdout = match PING.as_mut().unwrap().stdout.take() {
            Some(stdout) => stdout,
            None => return Err("Failed to get stdout".to_string()),
        };

        let stderr = match PING.as_mut().unwrap().stderr.take() {
            Some(stderr) => stderr,
            None => return Err("Failed to get stderr".to_string()),
        };

        let window_stdout = window.clone();
        std::thread::spawn(move || {
            let stdout_reader = BufReader::new(stdout);
            let stdout_lines = stdout_reader.lines();

            for line in stdout_lines {
                window_stdout.emit("ping-stdout", line.unwrap()).unwrap();
            }
        });

        let window_stderr = window.clone();
        std::thread::spawn(move || {
            let stderr_reader = BufReader::new(stderr);
            let stderr_lines = stderr_reader.lines();

            for line in stderr_lines {
                window_stderr.emit("ping-stderr", line.unwrap()).unwrap();
            }
        });

        std::thread::spawn(move || {
            PING.as_mut().unwrap().wait().unwrap();
            window.emit("ping-exit", None::<()>).unwrap();
            PING = None;
        });
    }

    Ok("Ping started".to_string())
}

#[tauri::command]
async fn stop_ping() -> Result<String, String> {
    unsafe {
        if let Some(mut child) = PING.take() {
            match child.kill() {
                Ok(_) => return Ok("Ping stopped".to_string()),
                Err(_) => return Err("Failed to stop ping".to_string()),
            }
        } else {
            Ok("Not pinging".to_string())
        }
    }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![start_ping, stop_ping])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
