# Ping UI

![Screenshot](https://raw.githubusercontent.com/12joan/ping-ui/main/.assets/screenshot.png)

A simple GUI for the `ping` command-line utility built using Tauri.

Requires `ping` to be in the PATH and for the output of `ping` to have the following format:

```
<BYTES> bytes from <HOST>: icmp_seq=<SEQ> ttl=<TTL> time=<TIME> ms
ping: sendto: No route to host
Request timeout for icmp_seq <SEQ>
```

If your version of `ping` doesn't work, create an issue or open a PR.

## Compatibility

✅ macOS (Fully compatible)

❓ Windows (Untested)

❓ Linux (Untested)

## Development

1. [Install Tauri](https://tauri.app/)
2. Install JS dependencies
  ```bash
  yarn install
  ```
3. Run tests
  ```bash
  yarn test
  ```
4. Run Tauri dev
  ```bash
  yarn tauri dev
  ```
5. (Optional) Build Tauri application
  ```bash
  yarn tauri build
  ```

## License

The source code is released under the [MIT No Attribution](https://choosealicense.com/licenses/mit-0/) license. Copyright notice is intentionally omitted.
