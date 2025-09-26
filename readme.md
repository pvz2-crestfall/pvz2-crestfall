# PvZ2 Crestfall

## How to install

TODO

## For developers

Please note that this repo contains only the modified files, so to build the mod yourself you will need to acquire a vanilla OBB first.

### Prerequisites

-   OBB file for PvZ2 9.8.0 or 9.8.1
-   [SEN 5](https://harumazzz.github.io/Sen.Environment/) for unpacking and building the OBB
-   [VSCode](https://code.visualstudio.com/) for editing the mod files
-   [SEN Helper](https://harumazzz.github.io/Sen.Environment/extension) if you're using VSCode

### How to start developing

1. **Install SEN**

    - Download the latest release from the [official site](https://harumazzz.github.io/Sen.Environment/).
    - Extract the ZIP file.
    - Add a system environment variable named `SEN_PATH` that points to your SEN installation directory.

2. **Clone this repository**

    ```bash
    git clone https://github.com/ZackGabri/pvz2-crestfall.git
    cd pvz2-crestfall
    ```

3. **Add the vanilla OBB**

    - Copy a valid PvZ2 OBB file into the project’s root folder.

4. **Unpack the OBB**

    ```bash
    npm run unpack
    ```

5. **Modify the files**

    - Edit any game assets or configuration files as you want

6. **Rebuild the OBB**

    ```bash
    npm run build
    ```

7. **Test your build**
    - Replace the game’s original OBB with your newly built one and there ya go!

## Disclaimer

This project is a **fan-made modification** of _Plants vs. Zombies 2_.
We are not affiliated with PopCap, EA, or any of their partners.
Use at your own risk.
