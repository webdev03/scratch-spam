import helpers as h
import sys
print("Welcome to Scratch Spam!")
h.HorizontalPrintBreak()
print("Importing modules...")
try:
  import requests
except ImportError:
  print("Hey! You need to have requests installed for this to work.")
  print("MAC: pip3 install requests")
  sys.exit()
print("Base modules successfully imported!")
h.HorizontalPrintBreak()
print("Scratch Spam saves you from spam.")