UPLOAD THESE FILES TO YOUR WEBSITE
==================================

Put the contents of THIS folder on the live site so they are reachable at:

  https://casperschepkens.com/jewelry_software/license.json
  https://casperschepkens.com/jewelry_software/jewelry-inventory-2.1.3.zip

If your Next.js app serves static files from /public, that usually means:

  public/jewelry_software/license.json
  public/jewelry_software/jewelry-inventory-2.1.3.zip

Or map a route /jewelry_software/* to these files.

Files in this pack (2.1.3)
--------------------------
  license.json                     kill switch + latest_version + shop accounts
  jewelry-inventory-2.1.3.zip      app release (extracts into client project/)

After upload, quick checks
--------------------------
  1. Open the two URLs above in a browser — both must download/show, not 404.
  2. license.json must have "latest_version": "2.1.3"
  3. Brugge shop: app_enabled / updates_enabled as you want.

Kill switch later
-----------------
  In ops admin, turn App enabled OFF for Brugge, then re-upload only license.json
  from hosting/upload/jewelry_software/ (or re-run the stage step).

Do NOT upload updater.py here — that stays on the shop PC next to project/.
