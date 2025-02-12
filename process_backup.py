import re, json
def process_backup():
    with open('local_backup.sql', 'r') as f:
        content = f.read()
