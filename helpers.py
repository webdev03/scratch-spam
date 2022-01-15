from html.parser import HTMLParser

def HorizontalPrintBreak():
  print()
  print("------------------")
  print()

def ResetAll(colorama_ins):
  print(colorama_ins.Style.RESET_ALL)

class MyHTMLParser(HTMLParser):
  def handle_starttag(self, tag, attrs):
    print(tag, attrs)