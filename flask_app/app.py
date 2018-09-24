import requests
import json
from flask import Flask, render_template
from time import sleep

user = "<ユーザー名（メールアドレス）>"
token = "<トークン>"
uri = "https://<ロケーション名>.azuredatabricks.net/api/2.0"

app = Flask(__name__)
call_job = uri + "/jobs/run-now"

@app.route('/')
def index():
  html = render_template('index.html', text = "Write a letter on the canvas")
  return html

@app.route('/score')
def run():

  data = '{ "job_id": 2, "notebook_params": { "dry-run": "true", "oldest-time-to-consider": "1457570074236" } }'

  rq0 = requests.post(call_job, auth=(user,token),data=data)
  num = str(rq0.json()["run_id"])
  sleep(40)
  job_output = uri +"/jobs/runs/get-output?run_id=" + num
  rq1 = requests.get(job_output, auth=(user,token))
  json = rq1.json()
  text = json["notebook_output"]['result']


  html = render_template('index.html', text = text)
  return html


if __name__ == "__main__":
  app.run()
