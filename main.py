""" INIT VARS """
MODES = [
  {
    "name": "Contains",
    "desc": "All posts containing the specified string will be shown."
  },
  {
    "name": "Regex",
    "desc": "Give a regex to test"
  },
  {
    "name": "Matcher ALPHA",
    "desc": "does nothing for now"
  }
]

import helpers as h
import sys
print("Welcome to Scratch Spam for Python 3!")
print("Importing modules...")


try:
  import requests
except ImportError:
  print("Hey! You need to have requests installed for this to work.")
  print("MAC: pip3 install requests")
  sys.exit()

try:
  import colorama
  colorama.init(autoreset=True)
except ImportError:
  print("Hey! You need to have colorama installed for this to work properly.")
  print("MAC: pip3 install colorama")
  sys.exit()

try:
  from bs4 import BeautifulSoup
except ImportError:
  print("Hey! For parsing, you need to have Beautiful Soup 4 installed for this to work properly.")
  print("MAC: pip3 install beautifulsoup4")
  sys.exit()


print(colorama.Fore.GREEN + "Base modules successfully imported!")
h.HorizontalPrintBreak()
user = input(colorama.Fore.BLUE + "Which user would you like to search for spam? ")
profile_req = requests.get(f"https://api.scratch.mit.edu/users/{user}/")
if not profile_req.ok:
  print(colorama.Fore.RED +"An error has occurred.")
  sys.exit()
print(colorama.Fore.GREEN + "User exists!")
h.HorizontalPrintBreak()
print("Choose your mode:")
print(colorama.Style.RESET_ALL)
c = 1
for i in MODES:
  print(f"{c}: {i['name']} - {i['desc']}")
  c += 1
print()
mode_num = int(input(colorama.Fore.YELLOW + "Enter in your mode number: "))
comments_html = requests.get(f"https://scratch.mit.edu/site-api/comments/user/{user}/?page=1").text
soup = BeautifulSoup(comments_html, "html.parser")
print(h.get_comments(user))