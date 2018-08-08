#!/usr/bin/python

import requests;
from flask import Flask, render_template, request

URL = 'https://api.fortnitetracker.com/v1/profile/pc/ninja'
headers = {'TRN-Api-Key' : '0bfa97b1-d015-481e-8736-48d3fea8cb36'}

# res = requests.get(URL, headers= headers)
# result = res.json()['lifeTimeStats']

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

def populate_player_data(api_data):

    temp_dict={};

    for r in api_data:
        if r['key'] == 'Wins':
            temp_dict['wins'] = r ['value']
        if r['key'] == 'Kills':
            temp_dict['kills'] = r ['value']
        if r ['key'] == 'Matches Played':
            temp_dict['matches'] = r['value']
    return temp_dict;

# print (populate_player_data(result))

if __name__ == '__main__':
    app.run(debug=True)
