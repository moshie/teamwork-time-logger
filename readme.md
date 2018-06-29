# Teamwork Time Logger

CLI Tool for Logging time for Teamwork

```bash
npm install teamwork-time-logger -g
```

## Setup config

In order to use the tool you need to define your domain and api key for connections to teamwork.

```bash
t config
```

## Log time

Log an hour and 15 minutes of time

```bash
t 1:15
```

Log 30 minutes of time

```bash
t 30
```

Log time to a particular task

```bash
t 1:00 --task=1234567
```
