FROM postgres:16
WORKDIR /app
COPY backup.sh /app/backup.sh
RUN chmod +x /app/backup.sh
CMD ["bash","-lc","echo 'Backup container ready. Use cron below.'"]
