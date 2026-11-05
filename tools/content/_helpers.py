import json
def P(jp, romaji, en, note=None, kana=None, grammar=None):
    d = {"jp": jp}
    if kana: d["kana"] = kana
    d.update({"romaji": romaji, "en": en})
    if note: d["note"] = note
    if grammar: d["grammar"] = grammar
    return d
def O(jp, romaji, en, kana=None):
    d = {"jp": jp}
    if kana: d["kana"] = kana
    d.update({"romaji": romaji, "en": en})
    return d
def T(name, jp, romaji, en, kana=None, note=None, fast=False):
    d = {"speaker": "them", "name": name, "jp": jp}
    if kana: d["kana"] = kana
    d.update({"romaji": romaji, "en": en})
    if note: d["note"] = note
    if fast: d["fast"] = True
    return d
def Y(prompt, options, note=None):
    d = {"speaker": "you", "prompt": prompt}
    if note: d["note"] = note
    d["options"] = options
    return d
def L(jp, romaji, en, meanings, prompt, replies, kana=None, note=None):
    d = {"jp": jp}
    if kana: d["kana"] = kana
    d.update({"romaji": romaji, "en": en, "meanings": meanings, "reply": {"prompt": prompt, "options": replies}})
    if note: d["note"] = note
    return d
