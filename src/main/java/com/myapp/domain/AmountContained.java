package com.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.myapp.domain.enumeration.Unit;
import java.io.Serializable;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A AmountContained.
 */
@Entity
@Table(name = "amount_contained")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class AmountContained implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "amount", nullable = false)
    private Float amount;

    @Enumerated(EnumType.STRING)
    @Column(name = "unit")
    private Unit unit;

    @ManyToOne
    private Mineral mineral;

    @ManyToOne
    @JsonIgnoreProperties(value = { "containedMinerals" }, allowSetters = true)
    private Food food;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public AmountContained id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Float getAmount() {
        return this.amount;
    }

    public AmountContained amount(Float amount) {
        this.setAmount(amount);
        return this;
    }

    public void setAmount(Float amount) {
        this.amount = amount;
    }

    public Unit getUnit() {
        return this.unit;
    }

    public AmountContained unit(Unit unit) {
        this.setUnit(unit);
        return this;
    }

    public void setUnit(Unit unit) {
        this.unit = unit;
    }

    public Mineral getMineral() {
        return this.mineral;
    }

    public void setMineral(Mineral mineral) {
        this.mineral = mineral;
    }

    public AmountContained mineral(Mineral mineral) {
        this.setMineral(mineral);
        return this;
    }

    public Food getFood() {
        return this.food;
    }

    public void setFood(Food food) {
        this.food = food;
    }

    public AmountContained food(Food food) {
        this.setFood(food);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof AmountContained)) {
            return false;
        }
        return id != null && id.equals(((AmountContained) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "AmountContained{" +
            "id=" + getId() +
            ", amount=" + getAmount() +
            ", unit='" + getUnit() + "'" +
            "}";
    }
}
