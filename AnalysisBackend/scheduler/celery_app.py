from celery import Celery
import os

app = Celery('scheduler',
             broker=os.getenv('CELERY_BROKER_URL', 'redis://localhost:6379/0'),
             backend=os.getenv('CELERY_RESULT_BACKEND', 'redis://localhost:6379/1'),
             include=['scheduler.task'])

# Windows compatibility
if os.name == 'nt':
    app.conf.worker_pool = 'solo'

app.conf.beat_schedule = {
    'sync-feedbacks-every-1-minutes': {
        'task': 'scheduler.task.periodic_sync',
        'schedule': 30.0,  # 1 minutes in seconds
    },
}
app.conf.timezone = 'UTC'