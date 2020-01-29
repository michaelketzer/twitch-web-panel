<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20190929154651 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('CREATE TABLE analytics (id INT AUTO_INCREMENT NOT NULL, date DATETIME NOT NULL, chatters INT NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE watcher (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, display_name VARCHAR(255) NOT NULL, time INT NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE bet_round (id INT AUTO_INCREMENT NOT NULL, season INT NOT NULL, round INT NOT NULL, started DATETIME NOT NULL, status VARCHAR(255) NOT NULL, result VARCHAR(4) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE bet (id INT AUTO_INCREMENT NOT NULL, watcher_id INT NOT NULL, round_id INT NOT NULL, date DATETIME NOT NULL, vote VARCHAR(4) NOT NULL, INDEX IDX_FBF0EC9BC300AB5D (watcher_id), INDEX IDX_FBF0EC9BA6005CA0 (round_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('ALTER TABLE bet ADD CONSTRAINT FK_FBF0EC9BC300AB5D FOREIGN KEY (watcher_id) REFERENCES watcher (id)');
        $this->addSql('ALTER TABLE bet ADD CONSTRAINT FK_FBF0EC9BA6005CA0 FOREIGN KEY (round_id) REFERENCES bet_round (id)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_8D93D649F85E0677 ON user (username)');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE bet DROP FOREIGN KEY FK_FBF0EC9BC300AB5D');
        $this->addSql('ALTER TABLE bet DROP FOREIGN KEY FK_FBF0EC9BA6005CA0');
        $this->addSql('DROP TABLE analytics');
        $this->addSql('DROP TABLE watcher');
        $this->addSql('DROP TABLE bet_round');
        $this->addSql('DROP TABLE bet');
        $this->addSql('DROP INDEX UNIQ_8D93D649F85E0677 ON user');
    }
}
