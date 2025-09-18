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

1. Clone this repo:
    ```bash
    git clone https://github.com/ZackGabri/pvz2-crestfall.git
    cd pvz2-crestfall
    ```
2. Place your OBB file in the root of this folder
3. Unpack the OBB files using SEN:
    1. Drag and drop your OBB onto `launcher.exe`
    2. When prompted, type `58` (Init Project)
    3. Choose Android or iOS depending on your target platform
    4. SEN will unpack and create a project folder structure for you
    5. Make sure to back up this file, as SEN will overwrite it when you try building the project files.
4. Edit the unpacked files (plants, zombies, UI, etc.) using VSCode.
5. Repack the OBB with SEN when done:
    1. Run `launcher.exe` on the `*.bundle` folder
    2. Use option `59` (Build Project)
    3. SEN will generate a new OBB file in the project folder
6. Replace the game's .obb with your newly built one.

## Disclaimer

This project is a **fan-made modification** of *Plants vs. Zombies 2*.
We are not affiliated with PopCap, EA, or any of their partners.
Use at your own risk.