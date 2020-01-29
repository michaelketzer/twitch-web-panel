<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20191002215159 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('CREATE TABLE message (id INT AUTO_INCREMENT NOT NULL, watcher_id INT NOT NULL, message LONGBLOB NOT NULL, INDEX IDX_B6BD307FC300AB5D (watcher_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE subscription (id INT AUTO_INCREMENT NOT NULL, watcher_id INT DEFAULT NULL, message LONGBLOB NOT NULL, months INT NOT NULL, sub_plan VARCHAR(255) NOT NULL, sub_plan_name VARCHAR(255) NOT NULL, INDEX IDX_A3C664D3C300AB5D (watcher_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('ALTER TABLE message ADD CONSTRAINT FK_B6BD307FC300AB5D FOREIGN KEY (watcher_id) REFERENCES watcher (id)');
        $this->addSql('ALTER TABLE subscription ADD CONSTRAINT FK_A3C664D3C300AB5D FOREIGN KEY (watcher_id) REFERENCES watcher (id)');
        $this->addSql('ALTER TABLE watcher ADD user_id INT NOT NULL');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('DROP TABLE message');
        $this->addSql('DROP TABLE subscription');
        $this->addSql('ALTER TABLE watcher DROP user_id');
    }
}
