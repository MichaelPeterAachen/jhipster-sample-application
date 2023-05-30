package com.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.v3.oas.annotations.media.Schema;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * not an ignored comment
 */
@Schema(description = "not an ignored comment")
@Entity
@Table(name = "food")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Food implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "name")
    private String name;

    @OneToMany(mappedBy = "food")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "mineral", "food" }, allowSetters = true)
    private Set<AmountContained> containedMinerals = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Food id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public Food name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<AmountContained> getContainedMinerals() {
        return this.containedMinerals;
    }

    public void setContainedMinerals(Set<AmountContained> amountContaineds) {
        if (this.containedMinerals != null) {
            this.containedMinerals.forEach(i -> i.setFood(null));
        }
        if (amountContaineds != null) {
            amountContaineds.forEach(i -> i.setFood(this));
        }
        this.containedMinerals = amountContaineds;
    }

    public Food containedMinerals(Set<AmountContained> amountContaineds) {
        this.setContainedMinerals(amountContaineds);
        return this;
    }

    public Food addContainedMinerals(AmountContained amountContained) {
        this.containedMinerals.add(amountContained);
        amountContained.setFood(this);
        return this;
    }

    public Food removeContainedMinerals(AmountContained amountContained) {
        this.containedMinerals.remove(amountContained);
        amountContained.setFood(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Food)) {
            return false;
        }
        return id != null && id.equals(((Food) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Food{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            "}";
    }
}
