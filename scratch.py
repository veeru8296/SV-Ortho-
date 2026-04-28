import urllib.request
import re

def compute_filter(r, g, b):
    # Just an approximation
    # Actually, getting a perfect filter is hard, let's just use:
    # brightness(0) saturate(100%) invert(...)
    pass

print("filter: brightness(0) saturate(100%) invert(48%) sepia(61%) saturate(2250%) hue-rotate(132deg) brightness(91%) contrast(101%);")
