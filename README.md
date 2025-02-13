# Training Hub

A Next.js application for managing training resources and learning pathways.

## Deployment Information

### Server Details
- **Server IP**: 178.18.248.49
- **Domain**: training.ols.to
- **Application Path**: `/var/www/Training`
- **Node Version**: 18.x
- **Database**: PostgreSQL
- **Process Manager**: PM2
- **Web Server**: Nginx

### Environment Setup
The application requires the following environment variables:
```env
DATABASE_URL=postgresql://corinfogarty:Training2024@127.0.0.1:5432/training_hub?schema=public
NEXTAUTH_URL=https://training.ols.to
NEXTAUTH_SECRET=your_secret_here
```

### Deployment Process
1. Push changes to the repository
2. SSH into the server:
   ```bash
   ssh root@178.18.248.49
   ```
3. Navigate to the application directory:
   ```bash
   cd /var/www/Training
   ```
4. Pull the latest changes:
   ```bash
   git pull
   ```
5. Install dependencies and rebuild:
   ```bash
   npm install
   npm run build
   ```
6. Restart the application:
   ```bash
   pm2 restart training
   ```

## Database Backups

### Backup System
- Automated backups run every hour
- Backups are stored in `/var/www/Training/backups/`
- Last 48 backups are retained (2 days worth)
- Backup files are named: `training_hub_YYYYMMDD_HHMMSS.sql.gz`

### Manual Backup
To create a manual backup:
```bash
/var/www/Training/scripts/backup-db.sh
```

### Restoring from Backup
1. SSH into the server
2. Navigate to the backups directory:
   ```bash
   cd /var/www/Training/backups
   ```
3. List available backups:
   ```bash
   ls -l
   ```
4. Uncompress the chosen backup:
   ```bash
   gunzip training_hub_YYYYMMDD_HHMMSS.sql.gz
   ```
5. Restore the database:
   ```bash
   psql -U corinfogarty training_hub < training_hub_YYYYMMDD_HHMMSS.sql
   ```

## Local Development

### Prerequisites
- Node.js 18.x
- PostgreSQL
- Git

### Setup
1. Clone the repository:
   ```bash
   git clone [repository-url]
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a local `.env` file with required environment variables
4. Initialize the database:
   ```bash
   npx prisma migrate dev
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run linting
- `npx prisma studio` - Open Prisma database GUI

## File Structure
```
Training/
├── app/                    # Next.js app directory
├── components/             # React components
├── lib/                    # Utility functions and shared code
├── prisma/                # Database schema and migrations
├── public/                # Static files
├── scripts/               # Maintenance and backup scripts
└── styles/                # CSS and styling files
```

## Browser Extension
- Located in `public/chrome-extension.zip`
- Installation instructions available in the application UI
- Allows direct resource submission from any webpage

## Cron Jobs
The following cron jobs are configured on the server:
```bash
*/15 * * * * curl -s https://training.ols.to/api/cron/update-profiles
0 * * * * /var/www/Training/scripts/backup-db.sh
```

## Troubleshooting

### Common Issues
1. **502 Bad Gateway**
   ```bash
   systemctl restart nginx
   pm2 restart training
   ```

2. **Database Connection Issues**
   - Check PostgreSQL service:
     ```bash
     systemctl status postgresql
     ```
   - Verify database connection:
     ```bash
     psql -U corinfogarty training_hub
     ```

3. **Application Not Starting**
   - Check PM2 logs:
     ```bash
     pm2 logs training
     ```
   - Verify Node.js version:
     ```bash
     node --version
     ```

### Server Maintenance
- Clear PM2 logs:
  ```bash
  pm2 flush
  ```
- View Nginx logs:
  ```bash
  tail -f /var/log/nginx/error.log
  ```
- Monitor disk space:
  ```bash
  df -h
  ```

## Security Notes
- SSL certificates are managed through Let's Encrypt
- Database backups are compressed and stored securely
- API keys and secrets should never be committed to the repository
- Regular security updates should be applied to the server

## Contact
For any issues or questions, please contact:
- Corin Fogarty (corin@theonline.studio) 